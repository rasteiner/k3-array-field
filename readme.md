## Blueprint
```
fields:
  emails:
    label: Emails
    type: array
    field:
      label: Email
      type: email
```

## Template
```
<?php foreach($page->emails()->yaml() as $email): ?>
  <a href="mailto:<?= email ?>"><?= email ?></a>
<?php endforeach; ?>
```

## Content file
```
Emails:
  - one@two.com
  - kirby@example.com
```
