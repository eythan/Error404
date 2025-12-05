<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NIRD - Navigation</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=VT323&display=swap');

        :root {
            --neon-blue: #00f3ff;
            --neon-pink: #bc13fe;
            --neon-green: #0aff0a;
            --bg-dark: #050510;
        }

        body {
            font-family: 'Orbitron', sans-serif;
            background-color: var(--bg-dark);
            color: #fff;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background-image:
                linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
            min-height: 100vh;
        }

        .nav-links {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin: 40px 0 20px 0;
            flex-wrap: wrap;
        }

        .nav-links a {
            color: var(--neon-green);
            text-decoration: none;
            font-weight: 700;
            font-size: 1.3rem;
            text-shadow: 0 0 5px var(--neon-green);
            transition: text-shadow 0.3s, color 0.3s;
        }

        .nav-links a:hover {
            color: var(--neon-pink);
            text-shadow: 0 0 15px var(--neon-green), 0 0 25px var(--neon-green);
        }

        .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 30px;
            background: rgba(0, 20, 40, 0.85);
            border: 1px solid var(--neon-blue);
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
            border-radius: 8px;
            position: relative;
        }

        .container::before {
            content: "SYSTEM_STATUS: ONLINE";
            position: absolute;
            top: -15px;
            left: 20px;
            background: var(--bg-dark);
            padding: 0 10px;
            color: var(--neon-green);
            font-family: 'VT323', monospace;
            font-size: 1.2rem;
        }

        h2 {
            font-family: 'Orbitron', sans-serif;
            font-size: 2rem;
            color: var(--neon-blue);
            margin-bottom: 20px;
            text-shadow: 0 0 10px var(--neon-blue);
        }

        p {
            font-family: 'VT323', monospace;
            font-size: 1.4rem;
            line-height: 1.6;
            color: #d0d0d0;
        }

        .highlight {
            color: var(--neon-green);
            text-shadow: 0 0 5px var(--neon-green);
        }

        @media (max-width: 600px) {
            .nav-links {
                flex-direction: column;
                gap: 20px;
            }
        }
    </style>
</head>

<body>
    <nav class="nav-links">
        <a href="index.php?controller=main&action=index">Accueil</a>
        <a href="index.php?controller=hiddensnake&action=index">Hidden Snake</a>
        <a href="index.php?controller=lazerguem&action=index">La zerguèm</a>
    </nav>
</body>

</html>