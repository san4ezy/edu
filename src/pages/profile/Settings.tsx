import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import HtmlConfigManager from "../../components/Admin/HtmlConfigManager";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faCog, faUser } from '@fortawesome/free-solid-svg-icons';

function SettingsPage() {
    const { isManager } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'html'>('profile');

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <div className="tabs tabs-bordered mb-6">
                <button 
                    className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profile Settings
                </button>
                {isManager && (
                    <button 
                        className={`tab ${activeTab === 'html' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('html')}
                    >
                        <FontAwesomeIcon icon={faCode} className="mr-2" />
                        HTML Configuration
                    </button>
                )}
            </div>

            {activeTab === 'profile' && (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">
                            <FontAwesomeIcon icon={faCog} className="mr-2" />
                            Profile Settings
                        </h2>
                        <p>Manage your profile settings here.</p>
                        
                        {/* Profile settings content can be added here later */}
                        <div className="alert alert-info">
                            <FontAwesomeIcon icon={faCog} />
                            <span>Profile settings will be implemented in a future update.</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'html' && isManager && (
                <HtmlConfigManager />
            )}
        </div>
    );
}

export default SettingsPage;