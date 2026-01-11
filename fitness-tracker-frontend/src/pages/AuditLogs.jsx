import React, { useState, useEffect } from 'react';
import auditService from '../services/auditService';
import { FileText, User, Shield, Ban, UserX, UserPlus, Clock } from 'lucide-react';
import TableSkeleton from '../components/TableSkeleton';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await auditService.getAllLogs();
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'BAN_USER':
                return <Ban size={18} className="text-red-600" />;
            case 'UNBAN_USER':
                return <UserPlus size={18} className="text-green-600" />;
            case 'DELETE_USER':
                return <UserX size={18} className="text-red-700" />;
            case 'PROMOTE_USER':
                return <Shield size={18} className="text-purple-600" />;
            default:
                return <FileText size={18} className="text-gray-600" />;
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'BAN_USER':
                return 'bg-red-100 text-red-800';
            case 'UNBAN_USER':
                return 'bg-green-100 text-green-800';
            case 'DELETE_USER':
                return 'bg-red-200 text-red-900';
            case 'PROMOTE_USER':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredLogs = filter === 'ALL' ? logs : logs.filter(log => log.action === filter);

    if (loading) return <div className="p-6"><TableSkeleton rows={10} columns={5} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FileText size={32} className="text-blue-600" />
                    Audit Logs
                </h1>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to clear ALL logs? This cannot be undone.")) {
                                try {
                                    await auditService.clearAllLogs();
                                    fetchLogs();
                                } catch (error) {
                                    console.error("Failed to clear logs", error);
                                }
                            }
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                        Clear All Logs
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                    {['ALL', 'BAN_USER', 'UNBAN_USER', 'DELETE_USER', 'PROMOTE_USER'].map((action) => (
                        <button
                            key={action}
                            onClick={() => setFilter(action)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === action
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {action.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Admin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Target User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            {formatDate(log.timestamp)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full ${getActionColor(log.action)}`}>
                                            {getActionIcon(log.action)}
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">{log.adminUsername}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{log.targetUsername}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredLogs.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No audit logs found for the selected filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
