// src/pages/DatasetDetailPage.jsx (Refined 'isOwner' check)

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getBackendActor } from "../services/backend";
import "../styles/detail.css";
import { shortenPrincipal } from "../utils/principal";
import { toast } from "react-toastify";
import { Principal } from '@dfinity/principal'; // Import Principal here

export default function DatasetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { iiPrincipal, loading } = useContext(UserContext);
    const [hasDownloadAccess, setHasDownloadAccess] = useState(false);
    const [dataset, setDataset] = useState(null);
    const [message, setMessage] = useState("");
    const [loadingDataset, setLoadingDataset] = useState(true);
    const [paymentMemo, setPaymentMemo] = useState("");

    useEffect(() => {
        const checkAccess = async () => {
            // Check if iiPrincipal is a valid Principal object before using it
            if (iiPrincipal instanceof Principal && dataset) {
                try {
                    const actor = await getBackendActor();
                    const access = await actor.has_access(BigInt(dataset.id));
                    setHasDownloadAccess(access);
                } catch (err) {
                    console.error("Error checking access:", err);
                    // Optionally set hasDownloadAccess to false or show a message
                }
            }
        };
        checkAccess();
    }, [iiPrincipal, dataset]);

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const actor = await getBackendActor();
                const all = await actor.get_all_datasets();
                const match = all.find((d) => Number(d[0]) === Number(id));

                if (match) {
                    setDataset({
                        id: Number(match[0]),
                        title: match[1],
                        category: match[2],
                        price: Number(match[3]),
                        wallet: match[4],
                        owner: match[5].toText(),
                    });
                } else {
                    setMessage("❌ Dataset not found.");
                }

                setLoadingDataset(false);
            } catch (err) {
                console.error("Failed to fetch dataset:", err);
                setMessage("❌ Could not load dataset.");
                setLoadingDataset(false);
            }
        })();
    }, [id]);

    const handleBack = () => navigate(-1);

    const handleRequest = async () => {
        if (!paymentMemo.trim()) {
            toast.error("Please enter your payment transaction ID or memo.");
            return;
        }

        try {
            const actor = await getBackendActor();
            const res = await actor.request_access(BigInt(id), paymentMemo.trim());
            setMessage(res);
            if (res.includes("submitted")) {
                toast.info("✅ Request submitted. Awaiting seller approval. (Memo: " + paymentMemo + ")");
                setPaymentMemo(''); // Clear memo after submission
            } else {
                toast.warning(res);
            }
        } catch (err) {
            setMessage("❌ Failed to request access.");
            toast.error("❌ Failed to request access.");
            console.error(err);
        }
    };

    const handleDownload = async () => {
        try {
            const actor = await getBackendActor();
            const res = await actor.view_dataset(BigInt(id));

            if ("Ok" in res) {
                const blob = new Blob([new Uint8Array(res.Ok)], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${dataset.title}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("🚀 Download started!");
            } else {
                toast.error(`Download failed: ${res.Err}`);
            }
        } catch (err) {
            toast.error("An error occurred during download.");
            console.error(err);
        }
    };

    if (loading || loadingDataset) return <p className="loading-text">⏳ Loading dataset...</p>;
    if (!dataset) return <p className="error-message">❌ Dataset not found.</p>;

    // Determine if the current user is the owner
    // Use 'instanceof Principal' for a robust type check
    const isOwner = iiPrincipal instanceof Principal && iiPrincipal.toText() === dataset.owner;

    return (
        <div className="detail-container">
            <button className="back-button" onClick={handleBack}>← Back</button>
            <h2 className="dataset-title">{dataset.title}</h2>
            <p className="dataset-info"><strong>Category:</strong> {dataset.category}</p>
            <p className="dataset-info"><strong>Price:</strong> {dataset.price} ICP</p>
            <p className="dataset-info"><strong>Seller Wallet:</strong> <span className="wallet-address">{dataset.wallet}</span></p>
            <p className="dataset-info"><strong>Owner:</strong> {shortenPrincipal(dataset.owner)}</p>

            <div className="detail-actions">
                {/* Conditional rendering for owner vs. buyer */}
                {isOwner ? (
                    <p className="owner-message">As the owner, you manage this dataset from the "My Uploads" page.</p>
                ) : (
                    iiPrincipal instanceof Principal ? ( // Check if iiPrincipal is a Principal object
                        hasDownloadAccess ? (
                            <div className="access-granted-section">
                                <p className="access-granted-message">You have approved access to this dataset!</p>
                                <button onClick={handleDownload} className="btn-secondary download-button">
                                    Download Dataset
                                </button>
                            </div>
                        ) : (
                            <div className="request-access-section">
                                <p className="request-access-instruction">
                                    To gain access, please make a payment of <strong className="price-highlight">{dataset.price} ICP</strong> to the seller's wallet: <code className="seller-wallet-highlight">{dataset.wallet}</code>.
                                </p>
                                <p className="request-access-instruction">
                                    After completing your payment, enter your transaction ID or a unique memo below to submit your access request.
                                </p>
                                <div className="memo-input-group">
                                    <input
                                        type="text"
                                        placeholder="Enter transaction ID or payment memo"
                                        value={paymentMemo}
                                        onChange={(e) => setPaymentMemo(e.target.value)}
                                        className="payment-memo-input"
                                    />
                                    <button onClick={handleRequest} className="btn-primary submit-request-button" disabled={!paymentMemo.trim()}>
                                        Submit Access Request
                                    </button>
                                </div>
                                {message && <p className="detail-message">{message}</p>}
                            </div>
                        )
                    ) : (
                        // User is not logged in (iiPrincipal is null or not a Principal)
                        <p className="login-prompt">Please log in to request access or download this dataset.</p>
                    )
                )}
            </div>
        </div>
    );
}