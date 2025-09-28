import React from 'react';

/**
 * this is all of the requiremnets that have been extracted can be viewed
 * @param {*} param0 
 * @returns html
 */
const RequirementsViewer = ({ requirements }) => {
    if (!requirements) return null;

    return (
        <div className="requirements">
            <h2>Extracted Requirements</h2>
            <p><strong>App Name:</strong> {requirements.appName}</p>
            <p><strong>Entities:</strong> {Object.keys(requirements?.entities ?? {}).join(", ")}</p>
            <p><strong>Roles:</strong> {requirements.roles.join(", ")}</p>
            <p><strong>Features:</strong> {requirements.features.join(", ")}</p>
        </div>
    );
};

export default RequirementsViewer;
