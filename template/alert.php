<?php if (isset($_SESSION['alert'])) : ?>
    <?php foreach ($_SESSION['alert'] as $class => $message) : ?>

        <div class="alert <?= $class ?>" role="alert">
            <p>
                <?= $message ?>
            </p>
            <button type="button" id="btn-close-alert" title="close">✕</button>
        </div>

    <?php endforeach; ?>
    <?php unset($_SESSION['alert']); ?>
<?php endif; ?>
