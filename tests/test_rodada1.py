"""Testes sem dependências externas para os requisitos da Rodada 1."""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")


class StructureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.attrs = []

    def handle_starttag(self, tag, attrs):
        self.tags.append(tag)
        self.attrs.append((tag, dict(attrs)))


class TestRodada1(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.parser = StructureParser()
        cls.parser.feed(HTML)

    def test_landmarks(self):
        for tag in ("header", "main", "footer"):
            with self.subTest(tag=tag):
                self.assertEqual(self.parser.tags.count(tag), 1)

    def test_exactly_two_tasks(self):
        self.assertEqual(self.parser.tags.count("li"), 2)

    def test_headings_hierarchy(self):
        self.assertEqual(self.parser.tags.count("h1"), 1)
        self.assertEqual(self.parser.tags.count("h3"), 2)
        self.assertGreaterEqual(self.parser.tags.count("h2"), 1)

    def test_accessible_status_text(self):
        self.assertIn('status--pending">Pendente', HTML)
        self.assertIn('status--done">Concluída', HTML)

    def test_page_language_and_viewport(self):
        self.assertIn('lang="pt-BR"', HTML)
        self.assertIn('name="viewport"', HTML)

    def test_stylesheet_link(self):
        self.assertIn('href="css/styles.css"', HTML)
        self.assertTrue((ROOT / "css" / "styles.css").is_file())

    def test_no_javascript(self):
        self.assertNotIn("<script", HTML.lower())
        self.assertEqual(list(ROOT.rglob("*.js")), [])

    def test_css_layout_and_responsiveness(self):
        for rule in ("display: flex", "display: grid", "@media", "clamp("):
            with self.subTest(rule=rule):
                self.assertIn(rule, CSS)

    def test_progress_is_static(self):
        self.assertRegex(HTML, r'<progress value="1" max="2"')


if __name__ == "__main__":
    unittest.main()
