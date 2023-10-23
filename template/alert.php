<?php if (isset($_SESSION['alert'])) : ?>
    <?php foreach ($_SESSION['alert'] as $class => $message) : ?>

        <div class="alert <?= $class ?>" role="alert">
            <p>
                <?= $message ?>
            </p>
        </div>

    <?php endforeach; ?>
    <?php unset($_SESSION['alert']); ?>
<?php endif; ?>