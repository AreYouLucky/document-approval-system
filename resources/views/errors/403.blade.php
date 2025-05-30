<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Access Denied</title>
    <link rel="stylesheet" href="styles.css" />
</head>

<body>

    <div class="container">
        <div class="inner-container">
            <div class="content">
                <img src="/storage/images/logo-front.png" loading="lazy" />
                <h1 class="tagline">Access Denied</h1>
                <h1 class="title">Insufficient Permissions</h1>
                <p class="description">Please contact the page administrator to update your role and gain access.</p>
                <a href="/" class="button">Go Home</a>

            </div>
        </div>
    </div>

</body>

</html>
<style>
    /* Base Styles */
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #ffffff;
    }

    /* Container with responsive vertical padding */
    .container {
        background-color: #ffffff;
        padding: 24px 0;
        /* Default: py-6 */
    }

    @media (min-width: 640px) {

        /* sm:py-8 */
        .container {
            padding-top: 32px;
            padding-bottom: 32px;
        }
    }

    @media (min-width: 1024px) {

        /* lg:py-12 */
        .container {
            padding-top: 48px;
            padding-bottom: 48px;
        }
    }

    /* Inner container for horizontal centering and max width */
    .inner-container {
        max-width: 1536px;
        /* Roughly equivalent to max-w-screen-2xl */
        margin: 0 auto;
        padding: 0 16px;
        /* Default: px-4 */
    }

    @media (min-width: 768px) {

        /* md:px-8 */
        .inner-container {
            padding: 0 32px;
        }
    }

    /* Content centered vertically and horizontally */
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    /* Logo Styles */
    .logo {
        margin-bottom: 32px;
        /* mb-8 */
        display: inline-flex;
        align-items: center;
        gap: 10px;
        /* Approximation for gap-2.5 (2.5 * 4px = 10px) */
        font-size: 1.5rem;
        /* Default text-2xl */
        font-weight: bold;
        color: #000000;
        text-decoration: none;
    }

    @media (min-width: 768px) {

        /* md:text-3xl */
        .logo {
            font-size: 1.875rem;
        }
    }

    /* SVG in the logo */
    .logo svg {
        width: 24px;
        /* w-6 */
        height: auto;
        /* h-auto */
        color: #6366f1;
        /* text-indigo-500 */
    }

    /* Tagline (That’s a 404) */
    .tagline {
        margin-bottom: 16px;
        /* mb-4 */
        font-size: 2rem;
        /* text-sm */
        font-weight: 600;
        /* font-semibold */
        text-transform: uppercase;
        color: #6366f1;
        /* text-indigo-500 */
    }

    @media (min-width: 768px) {

        /* md:text-base */
        .tagline {
            font-size: 2rem;
        }
    }

    /* Title (Page not found) */
    .title {
        margin-bottom: 8px;
        /* mb-2 */
        font-size: 1.5rem;
        /* text-2xl */
        font-weight: bold;
        color: #1f2937;
        /* text-gray-800 */
    }

    @media (min-width: 768px) {

        /* md:text-3xl */
        .title {
            font-size: 1.875rem;
        }
    }

    /* Description Paragraph */
    .description {
        margin-bottom: 48px;
        /* mb-12 */
        max-width: 768px;
        /* max-w-screen-md (approximate) */
        font-size: 1rem;
        color: #6b7280;
        /* text-gray-500 */
    }

    @media (min-width: 768px) {

        /* md:text-lg */
        .description {
            font-size: 1.125rem;
        }
    }

    /* Button Styles */
    .button {
        display: inline-block;
        background-color: #e5e7eb;
        /* bg-gray-200 */
        padding: 12px 32px;
        /* py-3 px-8 */
        font-size: 0.875rem;
        /* text-sm */
        font-weight: 600;
        /* font-semibold */
        color: #6b7280;
        /* text-gray-500 */
        border-radius: 8px;
        /* rounded-lg */
        text-align: center;
        text-decoration: none;
        transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
        outline: none;
        border: none;
        cursor: pointer;
    }

    .button:hover {
        background-color: #d1d5db;
        /* hover:bg-gray-300 */
    }

    .button:active {
        color: #374151;
        /* active:text-gray-700 */
    }

    @media (min-width: 768px) {

        /* md:text-base */
        .button {
            font-size: 1rem;
        }
    }
</style>
