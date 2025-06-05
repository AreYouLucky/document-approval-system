<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DocumentChange\DocumentChangeController;
use App\Http\Controllers\Users\UsersController;
use App\Http\Controllers\DocumentChange\AuditDocumentController;
use App\Http\Controllers\DocumentChange\DCReviewController;
use App\Http\Controllers\DocumentChange\QMRReviewController;
use App\Http\Controllers\DocumentChange\PDFVersionViewerController;

use App\Http\Controllers\MailController;

//PUBLIC GUEST ROUTES
Route::middleware(['guest'])->group(function () {
    Route::get('/guest-login', function () {
        return Inertia::render('Auth/Login');
    })->name('/guest-login');
    Route::get('/', function () {
        return Inertia::render('Public/GuestDashboard');
    })->name('/');
    Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'login']);
});
Route::get('/dc/review-document/{id}', [DCReviewController::class, 'initialReview']);
Route::get('/dc/final-review-document/{id}', [DCReviewController::class, 'FinalReview']);
Route::get('/qmr/review-document/{id}/{type}', [QMRReviewController::class, 'ViewQMRReview']);


Route::get('/load-documents', [DocumentChangeController::class, 'loadDocuments']);
Route::get('/view-pdf/{pdf}', [DocumentChangeController::class, 'viewPdf']);

//Authenticated Routes
Route::middleware(['auth:hris'])->group(function () {
    Route::get('/logout', [\App\Http\Controllers\Auth\LoginController::class, 'logout']);
    Route::get('/dashboard', function () {
        return Inertia::render('Public/Dashboard');
    });
    Route::get('/profile', function () {
        return Inertia::render('Profile/Profile');
    });
    Route::resource('/document-change', DocumentChangeController::class);
    Route::get('/document-list', function () {
        return Inertia::render('DocumentChange/DocumentList');
    });
    Route::get('/load-pending-documents', [DocumentChangeController::class, 'loadPendingDocuments']);
    Route::get('/get-document/{id}', [DocumentChangeController::class, 'getDocument']);
    Route::get('/view-document/{id}', function () {
        return Inertia::render('Public/ViewDocument');
    });
    Route::get('/get-document-by-code/{code}', [DocumentChangeController::class, 'getDocumentByCode']);
    Route::get('/get-document-timeline/{id}', [DocumentChangeController::class, 'getDocumentTimeline']);
    // PDF VIEWER
    Route::get('/view-document-versions/{title}', function () {
        return Inertia::render('Public/ViewDocumentVersions');
    });
    Route::get('/get-document-versions/{id}', [PDFVersionViewerController::class, 'getDocumentVersions']);
    Route::get('/get-document-version-history/{document_id}/{revision_id}', [PDFVersionViewerController::class, 'getDocumentVersionHistory']);
    Route::get('/load-documents-report', [DocumentChangeController::class, 'loadDocumentsReport']);
    Route::get('/process/view-documents', function () {
        return Inertia::render('DocumentChange/All/Layouts/ProcessDocumentTabs');
    });
    Route::get('/process/pending-list', function () {
        return Inertia::render('DocumentChange/All/DocumentList/PendingList');
    });
    Route::get('/process/revision-list', function () {
        return Inertia::render('DocumentChange/All/DocumentList/RevisionList');
    });
    Route::get('/process/rejected-list', function () {
        return Inertia::render('DocumentChange/All/DocumentList/RejectedList');
    });
    Route::get('/process/approved-list', function () {
        return Inertia::render('DocumentChange/All/DocumentList/ApprovedList');
    });

    Route::get('/request-document-change/{id}', function () {
        return Inertia::render('DocumentChange/All/RequestDocumentChange');
    });
    Route::get('/process/load-pending-documents', [DocumentChangeController::class, 'loadPendingDocuments']);
    Route::get('/process/load-revision-documents', [DocumentChangeController::class, 'loadForRevisionDocuments']);
    Route::get('/process/load-rejected-documents', [DocumentChangeController::class, 'loadRejectedDocuments']);
    Route::get('/process/load-approved-documents', [DocumentChangeController::class, 'loadApprovedDocuments']);
    Route::get('/process/view-revise-documents/{id}', [DocumentChangeController::class, 'viewReviseDocument']);
    Route::get('/process/get-revise-documents/{id}', [DocumentChangeController::class, 'getReviseDocument']);
    Route::post('/process/submit-revise-documents', [DocumentChangeController::class, 'submitDocumentRevision']);
    Route::get('/process/get-processes-count', [DocumentChangeController::class, 'documentListCount']);
});

// SUPER ADMIN ROUTES
Route::middleware(['auth:hris', 'role:Super Admin'])->group(function () {
    Route::get('/users', [UsersController::class, 'index']);
    Route::get('/load-users', [UsersController::class, 'loadUsers']);
    Route::post('/change-role', [UsersController::class, 'changeRole']);
});

// Document Custodian ROUTES
Route::middleware(['auth:hris', 'role:Document Custodian'])->group(function () {
    Route::get('/dc/view-document/{id}', [DCReviewController::class, 'reviewDocument']);
    Route::get('/dc/get-document-details/{id}', [DCReviewController::class, 'getDocumentDetails']);
    Route::get('/dc/initial-review-list', function () {
        return Inertia::render('DocumentChange/Dc/DocumentList/DcInitialReviewList');
    });
    Route::get('/dc/final-review-list', function () {
        return Inertia::render('DocumentChange/Dc/DocumentList/DcFinalReviewList');
    });
    Route::get('/dc/approve-list', function () {
        return Inertia::render('DocumentChange/Dc/DocumentList/DcApproveList');
    });
    Route::get('/dc/load-initial-review-documents', [DCReviewController::class, 'loadInitialReview']);
    Route::get('/dc/load-final-review-documents', [DCReviewController::class, 'loadFinalReview']);
    Route::get('/dc/final-review-document-auth/{id}', [DCReviewController::class, 'FinalreviewDocument']);
    Route::post('/dc/post-initial-review-documents', [DCReviewController::class, 'postInitialReview']);
    Route::get('/dc/load-approved-documents', [DCReviewController::class, 'loadApprovedDocuments']);


    Route::get('/dc/view-final-review-document/{id}', [DCReviewController::class, 'FinalreviewDocument']);
    Route::get('/dc/get-final-review-document-details/{id}', [DCReviewController::class, 'getFinalReviewDocumentDetails']);
    Route::post('/dc/affix-signatures', [DCReviewController::class, 'affixSignatures']);
    Route::post('/dc/save-as-pdf', [DCReviewController::class, 'saveAsPdf']);
    Route::post('/dc/reupload-pdf', [DCReviewController::class, 'reuploadPdf']);
    Route::post('/dc/submit-final-review', [DCReviewController::class, 'submitFinalReview']);
    Route::get('/dc/get-processes-count', [DCReviewController::class, 'documentListCount']);
});

Route::middleware(['auth', 'role:[QMR,Super Admin'])->group(function () {
    Route::resource('/audit-document', AuditDocumentController::class);
});

//QMR ROUTES
Route::middleware(['auth:hris', 'role:QMR'])->group(function () {
    Route::get('/qmr/document-list', function () {
        return Inertia::render('DocumentChange/QMR/DocumentList/ForReviewList');
    });

    Route::get('/qmr/load-for-review-documents', [QMRReviewController::class, 'loadForReviewDocuments']);
    Route::get('/qmr/load-approved-documents', [QMRReviewController::class, 'loadApprovedDocuments']);
    Route::get('/qmr/get-processes-count', [QMRReviewController::class, 'documentListCount']);



    Route::post('/qmr/submit-code', [QMRReviewController::class, 'validateQmrCode']);
    Route::get('/qmr/view-document/{id}', [QMRReviewController::class, 'reviewDocument']);
    Route::get('/qmr/get-document-details/{id}', [QMRReviewController::class, 'getDocumentDetails']);
    Route::post('/qmr/post-review-documents', [QMRReviewController::class, 'postQMRReview']);
});


Route::get('/send-mail', [MailController::class, 'sendEmail']);
