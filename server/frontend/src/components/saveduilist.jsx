import React from 'react';

/**
 * Lists all of the ui that has been saved
 * @param {*} param0 
 * @returns 
 */
const SavedUIList = ({ savedUIs, applySavedUI, saving, fetchSavedUIs }) => {
    return (
        <div className="saved-ui-container">
            <h3 className="saved-ui-title">Saved UIs</h3>
            <div className="saved-ui-list">
                {savedUIs.length === 0 ? (
                    <p className="saved-ui-empty">No saved UIs yet</p>
                ) : (
                    savedUIs.map((s) => (
                        <div key={s.id} className="saved-ui-card">
                            <div className="saved-ui-card-header">
                                <h4 className="saved-ui-name">
                                    {s.appName || s["App Name"] || "Unnamed"}
                                </h4>
                                <button 
                                    className="apply-btn" 
                                    onClick={() => applySavedUI(s)}
                                >
                                    Apply
                                </button>
                            </div>
                            <p className="saved-ui-roles">
                                Roles: 
                                { (s.roles || s.Roles || []).join(", ") || "No roles"}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SavedUIList;
