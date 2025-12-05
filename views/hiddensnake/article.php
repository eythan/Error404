<!-- article.php -->
<?php 
include 'header.php'; // Inclut le header, le CSS, et la balise <body>
?>

<div class="container">
    <h2><?php echo $data['pageTitle']; ?></h2>
    <p>
        <?php echo nl2br($data['viewContent']); ?>
    </p>

    <?php if (strpos($data['pageTitle'], 'CONTACT') !== false): ?>
    <div class="cta-box">
        <p style="font-size: 1.1rem; color: var(--neon-pink); font-style: italic;">
            [Veuillez contacter l'administrateur système pour la suite des instructions.]
        </p>
    </div>
    <?php endif; ?>
</div>

<?php 
include 'footer.php'; // Inclut le jeu Snake et les balises de fermeture
?>