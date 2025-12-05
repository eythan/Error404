<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>NIRD</title>
    <link rel="stylesheet" href="public/styles/main.css">
</head>

<body>
    <?php include 'layouts/header.php'; ?>
    <?php include 'views/chatbot/index.php'; ?>
    <div id="earth-container" class="earth-container"></div>
    <div id="message" class="message">
        <h1>Bienvenue les Nird</h1>
    </div>
    <div id="second-message"
        style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) scale(0); opacity:0; z-index:2; color:white; font-size:2em;">
        <h1>
            Initializing...
        </h1>
    </div>
    <div id="orbit-buttons" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">
    </div>
    <script type="module" src="public/javascript/main.js"></script>
</body>

</html>