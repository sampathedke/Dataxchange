// src/pages/AdminApprovalPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBackendActor } from "../services/backend";
import { UserContext } from "../context/UserContext";
import "../styles/admin.css"; // Ensure this CSS file exists for styling
import { toast } from "react-toastify";
import { shortenPrincipal } from "../utils/principal"; // Assuming you have this utility

export default function AdminApprovalPage() {
    const { id } = useParams(); // dataset ID from URL
    const { iiPrincipal, loading } = useContext(UserContext);
    const [pending, setPending] = useState([]); // This will now store array of [Principal, String]
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const fetchRequests = async () => {
        try {
            const backend = await getBackendActor();
            // The backend now returns Vec<(Principal, String)>
            const reqs = await backend.get_pending_requests(BigInt(id));
            setPending(reqs); // Store the [Principal, String] tuples directly
        } catch (err) {
            console.error("Error fetching pending requests:", err);
            setError("Failed to load requests. Make sure you are the dataset owner.");
        }
    };

    const handleApprove = async (buyerPrincipal) => { // Pass only the Principal for approval
        try {
            const backend = await getBackendActor();
            const msg = await backend.approve_buyer(BigInt(id), buyerPrincipal);
            setMessage(`✅ ${msg}`);
            toast.success(`✅ Approved buyer: ${shortenPrincipal(buyerPrincipal.toText())}`); // Use Principal for toast
            fetchRequests(); // Refresh list
        } catch (err) {
            console.error("Approval failed:", err);
            setError("Failed to approve buyer.");
            toast.error("❌ Failed to approve buyer.");
        }
    };

    // If you need a reject function, you can add it similarly
    // const handleReject = async (buyerPrincipal) => {
    //     try {
    //         const backend = await getBackendActor();
    //         // Assuming a reject_buyer function exists or you'd use approve_buyer with a different outcome
    //         // This is just a placeholder example, adapt as per your backend
    //         // const msg = await backend.reject_buyer(BigInt(id), buyerPrincipal);
    //         // setMessage(`❌ ${msg}`);
    //         // toast.error(`❌ Rejected buyer: ${shortenPrincipal(buyerPrincipal)}`);
    //         // fetchRequests(); // Refresh list
    //     } catch (err) {
    //         console.error("Rejection failed:", err);
    //         setError("Failed to reject buyer.");
    //         toast.error("❌ Failed to reject buyer.");
    //     }
    // };


    useEffect(() => {
        if (!loading && iiPrincipal) {
            fetchRequests();
        } else if (!loading && !iiPrincipal) {
            setError("You must be logged in to view the approval panel.");
        }
    }, [iiPrincipal, loading, id]); // Added 'id' to dependencies to refetch if dataset ID changes

    if (loading) return <p className="loading-text">Loading authentication status...</p>;
    if (!iiPrincipal) return <p className="login-prompt">Please log in to view the approval panel.</p>;
    if (error) return <p className="error-message">{error}</p>;


    return (
        <div className="admin-approval">
            <button className="back-button" onClick={handleBack}>← Back</button>
            <h3>🔐 Approve Buyers for Dataset #{id}</h3>

            {message && <p className="success-message">{message}</p>}

            {!pending.length ? (
                <p className="no-requests-message">No pending requests for this dataset.</p>
            ) : (
                <ul className="pending-list">
                    {pending.map(([buyerPrincipal, paymentMemo], i) => ( // Destructure the tuple here
                        <li key={i} className="pending-item">
                            <p><strong>Requester:</strong> <code>{shortenPrincipal(buyerPrincipal.toText())}</code></p>
                            <p className="payment-memo-display">
                                <strong>Payment Memo:</strong> <span className="memo-text">{paymentMemo || "N/A"}</span>
                            </p>
                            <button onClick={() => handleApprove(buyerPrincipal)} className="approve-button">Approve</button>
                            {/* You can add a Reject button here, calling handleReject */}
                            {/* <button onClick={() => handleReject(buyerPrincipal)} className="reject-button">Reject</button> */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}