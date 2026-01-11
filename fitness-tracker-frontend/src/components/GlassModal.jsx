import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

const GlassModal = ({ isOpen, onClose, title, message, onConfirm, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-6 overflow-hidden"
                    >
                        {/* Gradient Border Top */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${type === 'danger' ? 'from-red-500 to-pink-500' : 'from-violet-500 to-cyan-500'}`} />

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                {type === 'danger' && (
                                    <div className="p-2 bg-red-100 rounded-full text-red-500">
                                        <AlertTriangle size={24} />
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`px-6 py-2 rounded-xl font-bold text-white shadow-lg shadow-red-200 transition-all hover:scale-105 ${type === 'danger'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-red-200'
                                    : 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:shadow-violet-200'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GlassModal;
