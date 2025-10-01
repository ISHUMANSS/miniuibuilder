import React from 'react';

/**
 * this is the place where the user can type in their requirement for the ai
 * @param {*} param0 
 * @returns html
 */
const InputSection = ({ description, setDescription, onSubmit, loading }) => {
    return (
        <div className="input-section">
            <textarea
                rows={4}
                placeholder="e.g., I want an app to manage student courses and grades. Teachers add courses, students enroll, and admins manage reports."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
            />
            <button onClick={onSubmit} disabled={loading}>
                {loading ? "Generating..." : "Generate Requirements"}
            </button>
        </div>
    );
};

export default InputSection;
