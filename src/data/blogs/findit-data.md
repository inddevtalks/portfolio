Findit.com.mt is one of those directories that has everything and exports
nothing. Every plumber, dentist, hotel and lawyer in Malta is a public page.
None of it leaves the browser in a form a spreadsheet can use.

The job was not clever. Walk the category tree, open every profile, read the
four fields the site actually publishes — name, phone, email, website — and put
them in one file. The interesting part is what survives the cleanup.

> **What was kept.** Name · phone · email · website. Nothing else. No
> categories, no opening hours, no reviews, no coordinates. If the directory
> doesn't publish it as text, it doesn't exist here.

## The method

Four moves, repeated a few thousand times. The scripts are short; the patience
is the feature.

1. **Walk the tree.** Start from the site's own category index. Collect every
   listing page once, cache the URLs, and resume from a text file instead of
   starting over. *2,348 directory pages.*

2. **Read the cards.** Each category page is a grid of business cards. Pull the
   profile links out of it and ignore everything that points off-site.
   *1 request / second.*

3. **Open the profile.** The name lives in `h2.title`, the email in `a.email`,
   the phone in `p.phone`. A bare try/except per field means one broken page
   costs a cell, not the run. *4 fields per page.*

4. **Collapse and export.** Drop exact duplicates, fold case-variant names,
   merge the extra phones and emails, then write an xlsx for review and a csv
   for import. *8,769 → 2,501.*

The crawl is plain HTTP. **requests** holds the session, **BeautifulSoup**
reads the HTML, and a one-second pause sits between pages. No browser
automation, no stealth plugin, no proxy pool — the directory serves its
listings as ordinary pages, and the whole thing runs from a terminal.

The first pass returned **8,769 rows**. That is not 8,769 businesses. The same
clinic appears under three categories, a restaurant lists two numbers, a shop
is spelled two ways. Exact duplicates, then a case-insensitive name pass, fold
the file down to **2,501 businesses**. Every number below is what is left after
that.

The profile parser, in full:

```python
# every value is optional; a missing field never stops the page
row   = soup.select_one("div.row.row-listfull div.content")
name  = soup.find("h2", class_="title").get_text(strip=True)
email = soup.find("a", class_="email")
phone = soup.find("p", class_="phone")

data["name"]  = name
data["email"] = email.get_text(strip=True) if email else None
data["phone"] = phone.get_text(" ", strip=True) if phone else None

if data["phone"] and not re.search(r"\d", data["phone"]):
    data["phone"] = None
```

## The numbers

Eight thousand rows go in. Two and a half thousand businesses come out.

| | Count |
| --- | --- |
| Raw records | 8,769 |
| Businesses | 2,501 |
| Repeats folded | 6,268 — a 71.5% reduction |

### Contact coverage · 2,501 businesses

| Field | Share | Rows |
| --- | --- | --- |
| Phone | 95.8% | 2,397 |
| Email | 84.0% | 2,102 |
| Website | 70.1% | 1,753 |
| Email + phone | 81.3% | 2,034 |
| All three | 60.5% | 1,514 |

### Where the email lives · 2,102 addresses

| Domain | Addresses |
| --- | --- |
| gmail.com | 673 |
| hotmail.com | 116 |
| gov.mt | 77 |
| onvol.net | 62 |
| yahoo.com | 58 |

891 free-mail addresses · 1,211 on their own domain.

Three things the raw file also says:

- **538** businesses list a Facebook page where a website should be — 30.7% of
  the 1,753 with a link.
- **875** businesses publish more than one phone number. The extra digits stay
  in the export.
- **748** have no website, **104** no phone, **399** no email. Those gaps are
  in the file too.

## The fine print

A clean export is not a perfect one. These are the rough edges, left visible on
purpose.

**Free text, not numbers.** The directory writes a phone number the way a human
would: two lines, a contact name, sometimes an extension. 875 businesses carry
more than one number. They were kept, not flattened.

**A Facebook page is not a domain.** 538 of the 1,753 links point at Facebook.
Handy for outreach, no use for a domain check. Read the website column as "a
web presence", not "a website".

**Four columns, on purpose.** No categories, hours, reviews or coordinates. The
source shows those as page furniture, not as exportable fields. Guessing them
would be worse than leaving them out.

**Public, but still someone's data.** Every row came from a public page. The
export is for research and outreach, not resale — and if a business asks to be
removed, remove it. One request a second is the whole etiquette.

---

Built with Python · requests · BeautifulSoup · pandas · one second between
pages. Not affiliated with Findit — the data comes from public pages.
