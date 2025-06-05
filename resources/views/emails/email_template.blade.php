<!DOCTYPE html>
<html>
<head>
    <title>QMS Document Change Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: rgb(185, 233, 255);
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
        }
        .header {
            background: #f3f4f6;
            color: #333333;
            text-align: center; 
            padding: 10px;
            font-size: 20px;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 30px;
            font-size: 16px;
            color: #333;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #1d1d1d;
            border-top: 1px solid #ddd;
            padding: 15px 2px 25px 2px;
            background: #f3f4f6;
        }
        .button {
            font-family: 'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
            line-height: 16px;
            color: #ffffff;
            font-weight: 400;
            text-decoration: none;
            font-size: 16px;
            font-weight: 400;
            display: inline-block;
            padding: 20px 24px;
            background-color: #0062ff;
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
            background-color: #ff0000;
            color: white;
            width: 250px;
            padding: 15px;
        }
        .details{
            text-align: justify;
        }

        .body{
            width: 100%;
            background-color: #c0d8ff;
            padding: 20px 10px 20px 10px;
        }
    </style>
</head>
<body>
    <div class="body">
        <div class="email-container">
            <div class="header">
                <center>
                    <h3>QMS PORTAL</h3>
                </center>
            </div>
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
    </div>
    
</body>
</html>
