<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error 404</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<div class="container">
    <div class="content">
        <div class="grid">
            <!-- image - start -->
            <div class="image-container">
                <img src="/storage/images/logo-front.png" loading="lazy" />
            </div>
            <!-- image - end -->

            <!-- content - start -->
            <div class="text-content">
                <p class="error-text">Error 404</p>
                <h1 class="error-title">Page not found</h1>
                <p class="error-description">The page you’re looking for doesn’t exist.</p>
                <a href="/" class="button">Go home</a>
            </div>
            <!-- content - end -->
        </div>
    </div>
</div>

</body>

<style>
    /* General Styles */
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90vh;
}

/* Main Container */
.container {
    background-color: white;
    padding: 24px 16px;
}

.content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
}

/* Grid Layout */
.grid {
    display: grid;
    gap: 32px;
}

@media (min-width: 640px) {
    .grid {
        grid-template-columns: 1fr 1fr;
        gap: 48px;
    }
}
.image-container{
    height: 100%;
    display: flex;
    align-items: center;

}
.image-container img {
    width: 100%;
}

/* Content Section */
.text-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 0;
}

@media (min-width: 640px) {
    .text-content {
        align-items: flex-start;
        text-align: left;
    }
}

.error-text {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    color: #6366f1;
}

.error-title {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: bold;
    color: #1f2937;
}

@media (min-width: 768px) {
    .error-title {
        font-size: 30px;
    }
}

.error-description {
    margin-bottom: 32px;
    color: #6b7280;
    font-size: 16px;
}

.button {
    display: inline-block;
    padding: 12px 32px;
    background-color: #e5e7eb;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.2s, color 0.2s;
}

.button:hover {
    background-color: #d1d5db;
}

.button:active {
    color: #374151;
}

</style>
