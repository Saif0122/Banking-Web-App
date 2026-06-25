import AuditLog from '../models/auditLog.model.js';

/**
 * Creates a system audit log.
 * @param {Object} params - Audit parameters.
 * @param {string} params.action - Action type (e.g. LOGIN, DEPOSIT, etc.)
 * @param {string} [params.user] - ID of the user performing or associated with the action
 * @param {Object} [params.metadata] - Additional structured context about the action
 * @param {string} [params.ipAddress] - IP address of the requester
 * @param {string} [params.userAgent] - User agent string of the requester
 * @returns {Promise<Object>} The saved audit log document
 */
export const logAction = async ({ action, user, metadata = {}, ipAddress = '', userAgent = '' }) => {
  try {
    const log = await AuditLog.create({
      action,
      user: user || null,
      metadata,
      ipAddress,
      userAgent
    });
    return log;
  } catch (error) {
    // Fail silently to keep application flow uninterrupted, but log for visibility
    console.error('Audit Log Error:', error.message);
  }
};
