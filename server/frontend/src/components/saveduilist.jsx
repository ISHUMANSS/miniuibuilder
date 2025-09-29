import React from 'react';

/**
 * Lists all of the ui that has been saved
 * @param {*} param0 
 * @returns 
 */
const SavedUIList = ({ savedUIs, applySavedUI, saving, fetchSavedUIs }) => {
    return (
        <div className="saved-ui-container">
            <h4>Saved UIs</h4>
            <div className="saved-ui-list">
                {savedUIs.length === 0 && <p>No saved UIs</p>}
                {savedUIs.map((s) => (
                    <div key={s.id} className="saved-ui-item">
                        <div className="saved-ui-item-header">
                            <strong className="saved-ui-item-name">{s.appName || s["App Name"] || "Unnamed"}</strong>
                            <div className="saved-ui-item-actions">
                                <button onClick={() => applySavedUI(s)}>Apply</button>
                            </div>
                        </div>
                        <div className="saved-ui-item-roles">{(s.roles || s.Roles || []).join(", ")}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedUIList;
