<!DOCTYPE html>
<html>
<head>
    <title>QMS Document Change Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #0073e6;
            color: #ffffff;
            text-align: center; 
            padding: 15px;
            font-size: 20px;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .button {
            font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
            line-height: 16px;
            color: #ffffff;
            font-weight: 400;
            text-decoration: none;
            font-size: 14px;
            display: inline-block;
            padding: 10px 24px;
            background-color: #4184f3;
            border-radius: 5px;
            border: 0px;
            min-width: 90px;
            cursor: pointer;
        }
        a{
            text-decoration: none;
            color: white;
        }
        .code{
            padding: 0px 10px 0px 10px; 
        }
        .code-text{
            background-color: #333;
            color: white;
            width: 250px;
            padding: 15px;
        }
        .details{
            text-align: justify;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">QMS Document Change Request</div>
        <div class="content">
            <h3>Good Day, {{ $details['name'] }}</h3>
            <p class="details">{{ $details['message'] }}</p>
            
            @if(!empty($details['code']))
            <center>
                <div class="code">
                        <h2 class="code-text">{{ $details['code'] }}</h2>
                </div>
            </center>
            @endif

            <p>Your feedback would be highly appreciated. Thank you for your time and consideration.</p>
            
            <center><a  href="{{$details['link']}}"><button class="button">Redirect to Document</button></a></center>
        </div>
        <div class="footer">
            <p>Best Regards,</p>
            <span><strong>{{ $details['sender'] }}</strong></span>,
            <span>DOST-STII, {{ $details['position'] }}</span>
        </div>
    </div>
</body>
</html>
