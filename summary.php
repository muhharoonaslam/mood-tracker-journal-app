<?php
/**
 * Paper & Ink Journal — PHP Summary Page
 * Reads directly from the same SQLite database used by the .NET API.
 *
 * Usage: php -S localhost:8080 summary.php
 * Then open http://localhost:8080 in your browser.
 */

$dbPath = getenv('DB_PATH') ?: __DIR__ . '/db/mood_tracker.db';

if (!file_exists($dbPath)) {
    die('<p style="color:red;font-family:sans-serif;padding:2rem;">Database not found at: ' . htmlspecialchars($dbPath) . '<br>Run the .NET API at least once to initialise the database.</p>');
}

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('<p style="color:red;font-family:sans-serif;padding:2rem;">Could not open database: ' . htmlspecialchars($e->getMessage()) . '</p>');
}

$stmt = $pdo->query(
    'SELECT me.Id, me.UserId, u.Email, me.MoodType, me.TimestampUtc, me.Note
     FROM MoodEntries me
     JOIN Users u ON u.Id = me.UserId
     ORDER BY me.TimestampUtc DESC'
);
$entries = $stmt->fetchAll(PDO::FETCH_ASSOC);

$moodColors = [
    'Happy'   => '#E8913A',
    'Neutral' => '#7A8B69',
    'Sad'     => '#6B8CAE',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paper &amp; Ink — Mood Summary</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #F5F0E8;
      color: #2C1810;
      font-family: 'Lato', sans-serif;
      min-height: 100vh;
    }
    header {
      background: #2C1810;
      color: #F5F0E8;
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      font-weight: 700;
    }
    header span {
      font-size: 0.85rem;
      color: #C4A882;
    }
    main {
      max-width: 1100px;
      margin: 2.5rem auto;
      padding: 0 1.5rem;
    }
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: #2C1810;
    }
    .count {
      font-size: 0.9rem;
      color: #6B5344;
      margin-bottom: 1.5rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #EDE8DA;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(44,24,16,0.10);
    }
    thead tr {
      background: #2C1810;
      color: #F5F0E8;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.9rem;
      border-bottom: 1px solid #C4A882;
    }
    th { font-weight: 700; letter-spacing: 0.03em; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #F5F0E8; }
    .mood-badge {
      display: inline-block;
      padding: 0.2rem 0.65rem;
      border-radius: 99px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #fff;
    }
    .note-cell {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #6B5344;
      font-style: italic;
    }
    .empty {
      text-align: center;
      padding: 3rem;
      color: #6B5344;
      font-style: italic;
    }
    footer {
      text-align: center;
      padding: 2rem;
      color: #6B5344;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>Paper &amp; Ink Journal</h1>
    <span>PHP Summary Page</span>
  </header>
  <main>
    <h2>All Mood Entries</h2>
    <p class="count"><?= count($entries) ?> total entries</p>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Email</th>
          <th>Mood</th>
          <th>Timestamp (UTC)</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($entries)): ?>
        <tr><td colspan="6" class="empty">No mood entries found. Log some moods in the app first.</td></tr>
        <?php else: ?>
          <?php foreach ($entries as $row): ?>
          <?php $color = $moodColors[$row['MoodType']] ?? '#999'; ?>
          <tr>
            <td><?= (int)$row['Id'] ?></td>
            <td><?= (int)$row['UserId'] ?></td>
            <td><?= htmlspecialchars($row['Email']) ?></td>
            <td>
              <span class="mood-badge" style="background:<?= $color ?>">
                <?= htmlspecialchars($row['MoodType']) ?>
              </span>
            </td>
            <td><?= htmlspecialchars($row['TimestampUtc']) ?></td>
            <td class="note-cell" title="<?= htmlspecialchars($row['Note'] ?? '') ?>">
              <?= $row['Note'] ? htmlspecialchars($row['Note']) : '<em style="color:#bbb">—</em>' ?>
            </td>
          </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </main>
  <footer>Paper &amp; Ink Journal &mdash; PHP reads directly from mood_tracker.db</footer>
</body>
</html>
