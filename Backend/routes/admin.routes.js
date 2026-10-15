const express = require("express");
const router = express.Router();

const { createEmployee, getEmployees, getEmployeeById, updateEmployee, changeEmployeeStatus, deleteEmployee, updateUserPermissions, parseEmployeePayload } = require("../controllers/admin.controller");
const {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    changeDepartmentStatus,
    deleteDepartment
} = require("../controllers/department.controller");
const {
    createDesignation,
    getDesignations,
    getDesignationById,
    getDesignationsByDepartment,
    updateDesignation,
    changeDesignationStatus,
    deleteDesignation
} = require("../controllers/designation.controller");
const {
    createEmployeeType,
    getEmployeeTypes,
    getEmployeeTypeById,
    updateEmployeeType,
    changeEmployeeTypeStatus,
    deleteEmployeeType
} = require("../controllers/employeeType.controller");
const {
    createWorkMode,
    getWorkModes,
    getWorkModeById,
    updateWorkMode,
    changeWorkModeStatus,
    deleteWorkMode
} = require("../controllers/workMode.controller");
const {
    createLeaveType,
    getLeaveTypes,
    getLeaveTypeById,
    updateLeaveType,
    changeLeaveTypeStatus,
    deleteLeaveType
} = require("../controllers/leaveType.controller");
const {
    createLeaveAssignment,
    saveLeaveAssignments,
    getLeaveAssignments,
    getLeaveAssignmentById,
    updateLeaveAssignment,
    deleteLeaveAssignment
} = require("../controllers/leaveAssignment.controller");
const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
} = require("../controllers/service.controller");
const {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
} = require("../controllers/client.controller");
const {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    getLeadAssignees,
    assignLead
} = require("../controllers/lead.controller");
const {
    createFollowUp,
    getLeadFollowUps,
    getDueFollowUps
} = require("../controllers/followUp.controller");
const { listSales, listPayments, listRevenue } = require("../controllers/sale.controller");
const { downloadLeadSample, importLeads, exportLeads } = require("../controllers/leadSheet.controller");
const { getReportCatalog, getReport, getReportOptions } = require("../controllers/report.controller");
const { getDashboard } = require("../controllers/dashboard.controller");
const { getAttendance, punchAttendance, attendanceEmployees } = require("../controllers/attendance.controller");
const rateLimit = require("express-rate-limit");
const { registerValidator } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const { receiveEmployeeDocuments, receiveLeaveDocument, receiveTicketFile, receiveReportFiles, receiveResume, receiveLogo, receiveLeadSheet, receiveAttendancePhoto } = require("../config/cloudinary");
const punchLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `punch:${req.user._id}`,
    message: { success: false, message: "Too many punch attempts. Try again in a few minutes." },
});
const { getSettings, updateSettings, clearSettingField } = require("../controllers/settings.controller");
const {
    getOfferLetter,
    generateOfferLetter,
    downloadOfferLetter,
    sendOfferLetterMail
} = require("../controllers/offerLetter.controller");
const {
    createUrgentWork,
    getUrgentWorks,
    getUrgentWorkOptions,
    getUrgentWorkById,
    updateUrgentWork,
    deleteUrgentWork
} = require("../controllers/urgentWork.controller");
const {
    createTicket,
    getTickets,
    getTicketById,
    replyToTicket,
    updateTicketStatus,
    deleteTicket
} = require("../controllers/ticket.controller");
const {
    listReports,
    createReport,
    updateReport,
    deleteReport
} = require("../controllers/dailyReport.controller");
const {
    createProject,
    getProjects,
    getProjectEmployees,
    getProjectById,
    updateProject,
    updateProjectStatus,
    deleteProject
} = require("../controllers/project.controller");
const {
    createInterview,
    getInterviews,
    getInterviewers,
    getInterviewById,
    updateInterview,
    deleteInterview
} = require("../controllers/interview.controller");
const {
    createLeaveRequest,
    listMine,
    myBalance,
    listQueue,
    updateLeaveRequest,
    deleteLeaveRequest,
    reviewLeaveRequest
} = require("../controllers/leaveRequest.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate, authorize("ADMIN", "EMPLOYEE"));

router.post("/employees/create", receiveEmployeeDocuments, parseEmployeePayload, registerValidator, validate, createEmployee);
router.get("/employees/list", getEmployees);
router.get("/employees/details/:id", getEmployeeById);
router.get("/employees/:id/offer-letter", getOfferLetter);
router.post("/employees/:id/offer-letter", generateOfferLetter);
router.get("/employees/:id/offer-letter/pdf", downloadOfferLetter);
router.post("/employees/:id/offer-letter/send", sendOfferLetterMail);
router.patch("/employees/update/:id", receiveEmployeeDocuments, parseEmployeePayload, updateEmployee);
router.patch("/employees/status/:id", changeEmployeeStatus);
router.delete("/employees/:id", deleteEmployee);
router.put("/users/:id/permissions", updateUserPermissions);

router.post("/departments/create", createDepartment);
router.get("/departments/list", getDepartments);
router.get("/departments/details/:id", getDepartmentById);
router.patch("/departments/update/:id", updateDepartment);
router.patch("/departments/status/:id", changeDepartmentStatus);
router.delete("/departments/:id", deleteDepartment);

router.post("/designations/create", createDesignation);
router.get("/designations/list", getDesignations);
router.get("/designations/details/:id", getDesignationById);
router.get("/designations/list/department/:departmentId", getDesignationsByDepartment);
router.patch("/designations/update/:id", updateDesignation);
router.patch("/designations/status/:id", changeDesignationStatus);
router.delete("/designations/:id", deleteDesignation);

router.post("/employee-types/create", createEmployeeType);
router.get("/employee-types/list", getEmployeeTypes);
router.get("/employee-types/details/:id", getEmployeeTypeById);
router.patch("/employee-types/update/:id", updateEmployeeType);
router.patch("/employee-types/status/:id", changeEmployeeTypeStatus);
router.delete("/employee-types/:id", deleteEmployeeType);

router.post("/work-modes/create", createWorkMode);
router.get("/work-modes/list", getWorkModes);
router.get("/work-modes/details/:id", getWorkModeById);
router.patch("/work-modes/update/:id", updateWorkMode);
router.patch("/work-modes/status/:id", changeWorkModeStatus);
router.delete("/work-modes/:id", deleteWorkMode);

router.post("/leave-types/create", createLeaveType);
router.get("/leave-types/list", getLeaveTypes);
router.get("/leave-types/details/:id", getLeaveTypeById);
router.patch("/leave-types/update/:id", updateLeaveType);
router.patch("/leave-types/status/:id", changeLeaveTypeStatus);
router.delete("/leave-types/:id", deleteLeaveType);

router.post("/leave-assignments/create", createLeaveAssignment);
router.post("/leave-assignments/save", saveLeaveAssignments);
router.get("/leave-assignments/list", getLeaveAssignments);
router.get("/leave-assignments/details/:id", getLeaveAssignmentById);
router.patch("/leave-assignments/update/:id", updateLeaveAssignment);
router.delete("/leave-assignments/:id", deleteLeaveAssignment);

router.post("/services/create", createService);
router.get("/services/list", getServices);
router.get("/services/details/:id", getServiceById);
router.patch("/services/update/:id", updateService);
router.delete("/services/:id", deleteService);

router.post("/clients/create", createClient);
router.get("/clients/list", getClients);
router.get("/clients/details/:id", getClientById);
router.patch("/clients/update/:id", updateClient);
router.delete("/clients/:id", deleteClient);

router.post("/leads/create", createLead);
router.get("/leads/sample", downloadLeadSample);
router.get("/leads/export", exportLeads);
router.post("/leads/import", receiveLeadSheet, importLeads);
router.get("/leads/list", getLeads);
router.get("/leads/assignees", getLeadAssignees);
router.get("/leads/details/:id", getLeadById);
router.patch("/leads/update/:id", updateLead);
router.patch("/leads/:id/assign", assignLead);
router.delete("/leads/:id", deleteLead);
router.get("/leads/:id/follow-ups", getLeadFollowUps);
router.post("/leads/:id/follow-ups", createFollowUp);
router.get("/follow-ups/due", getDueFollowUps);
router.get("/sales/list", listSales);
router.get("/payments/list", listPayments);
router.get("/revenue/list", listRevenue);
router.get("/dashboard/summary", getDashboard);
router.get("/reports/catalog", getReportCatalog);
router.get("/reports/options", getReportOptions);
router.get("/reports", getReport);
router.get("/attendance/employees", attendanceEmployees);
router.get("/attendance", getAttendance);
router.post("/attendance/punch", punchLimiter, receiveAttendancePhoto, punchAttendance);

router.get("/leave-requests/mine", listMine);
router.get("/leave-requests/balance", myBalance);
router.get("/leave-requests/queue", listQueue);
router.post("/leave-requests", receiveLeaveDocument, createLeaveRequest);
router.patch("/leave-requests/:id/review", reviewLeaveRequest);
router.patch("/leave-requests/:id", receiveLeaveDocument, updateLeaveRequest);
router.delete("/leave-requests/:id", deleteLeaveRequest);

router.post("/urgent-works/create", receiveTicketFile, createUrgentWork);
router.get("/urgent-works/list", getUrgentWorks);
router.get("/urgent-works/options", getUrgentWorkOptions);
router.get("/urgent-works/details/:id", getUrgentWorkById);
router.patch("/urgent-works/update/:id", receiveTicketFile, updateUrgentWork);
router.delete("/urgent-works/:id", deleteUrgentWork);

router.post("/tickets/create", receiveTicketFile, createTicket);
router.get("/tickets/list", getTickets);
router.get("/tickets/details/:id", getTicketById);
router.post("/tickets/:id/replies", replyToTicket);
router.patch("/tickets/:id/status", updateTicketStatus);
router.delete("/tickets/:id", deleteTicket);

router.post("/projects/create", createProject);
router.get("/projects/list", getProjects);
router.get("/projects/employees", getProjectEmployees);
router.get("/projects/details/:id", getProjectById);
router.get("/projects/:id/reports", listReports);
router.post("/projects/:id/reports", receiveReportFiles, createReport);
router.patch("/projects/:id/reports/:reportId", receiveReportFiles, updateReport);
router.delete("/projects/:id/reports/:reportId", deleteReport);
router.patch("/projects/update/:id", updateProject);
router.patch("/projects/:id/status", updateProjectStatus);
router.delete("/projects/:id", deleteProject);

router.post("/interviews/create", receiveResume, createInterview);
router.get("/interviews/list", getInterviews);
router.get("/interviews/interviewers", getInterviewers);
router.get("/interviews/details/:id", getInterviewById);
router.patch("/interviews/update/:id", receiveResume, updateInterview);
router.delete("/interviews/:id", deleteInterview);

router.get("/settings", getSettings);
router.patch("/settings", receiveLogo, updateSettings);
router.delete("/settings/field/:field", clearSettingField);

module.exports = router;
