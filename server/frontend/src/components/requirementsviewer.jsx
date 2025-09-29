import React from 'react';

/**
 * this is all of the requiremnets that have been extracted can be viewed
 * @param {*} param0 
 * @returns html
 */
const RequirementsViewer = ({ requirements, onSave, saving }) => {
    if (!requirements) return null;

    return (
        <div className="requirements">
            <h2>Extracted Requirements</h2>
            <p><strong>App Name:</strong> {requirements.appName}</p>
            <p><strong>Roles:</strong> {requirements.roles.join(", ")}</p>
            <p><strong>Entities:</strong> {Object.keys(requirements?.entities ?? {}).join(", ")}</p>
            <div>
                    <strong>Entities by Role:</strong>
                <ul>
                    {Object.entries(requirements?.entities || {}).map(([role, entityObj]) => (
                    <li key={role}>
                        <strong>{role}:</strong> {Object.keys(entityObj).join(", ")}
                    </li>
                    ))}
                </ul>
            </div>
            
            
            <div>
                <strong>Features by Role:</strong>
                <ul>
                    {Object.entries(requirements.features || {}).map(([role, features]) => (
                        <li key={role}>
                            <strong>{role}:</strong> {features.join(", ")}
                        </li>
                    ))}
                </ul>
            </div>

            {/* save button */}
            <div className="requirements-save">
                <button onClick={onSave} disabled={saving || !requirements}>
                    {saving ? "Saving..." : "Save Requirements"}
                </button>
            </div>
        </div>
    );
};

export default RequirementsViewer;
