# Historical Accuracy & Photo Sourcing Guide

## Current Status

### What's Factual
- **Deities**: Hecate, The Morrigan, Cerridwen, Arianrhod are real deities with documented worship revival in 1910-1945
- **Historical Figures**: Gardner, Fortune, Crowley, Graves, Yeats are real people with documented contributions
- **Sacred Sites**: All locations (Stonehenge, Glastonbury Tor, etc.) are real places with verified historical significance
- **Timeline Events**: Based on documented occurrences with dates and sources
- **Rituals**: Based on practices documented in historical texts

### What Needs Verification
- **Gardner's New Forest Coven**: Scholarly consensus is skeptical of "ancient lineage" claims
  - Likely a small 1930s group influenced by contemporary occultism
  - Gardner significantly reworked practices into Wicca
  - Sources: Ronald Hutton's "Triumph of the Moon", Philip Heselton's research

### Current Placeholder Elements
1. **Photos**: Using stock photos from Unsplash instead of actual historical photographs
2. **Some biographical details**: Simplified for readability

## Photo Sourcing Plan

### Where to Find Authentic Public Domain Photos

#### Gerald Gardner (1884-1964)
- **Wikimedia Commons**: Search "Gerald Gardner public domain"
- **Internet Archive**: Scans from "Witchcraft Today" (1954) and other publications
- **Likely available**: Post-1940s photos from his published works

#### Dion Fortune (1890-1946)
- **Challenge**: Successor destroyed most photographs
- **Sources**:
  - Internet Archive: Alan Richardson biographies
  - Pre-1929 US publications (public domain)
  - UK pre-1956 lapsed copyrights
- **Status**: Rare but some exist

#### Aleister Crowley (1875-1947)
- **Abundant**: Many public domain photos available
- **Wikimedia Commons**: 1920s-1940s portraits
- **Internet Archive**: Photos from various publications
- **Status**: Easy to source

#### W.B. Yeats (1865-1939)
- **Abundant**: Well-documented public figure
- **National Library of Ireland**: Digital collections
- **Wikimedia Commons**: Multiple portraits
- **Status**: Easy to source

### Implementation Steps

1. **Search Repositories**:
   - Wikimedia Commons (filter: public domain)
   - Internet Archive (digitized books with photos)
   - Flickr Commons
   - New York Public Library Digital Collections
   - British Library Flickr
   - Europeana

2. **Verification**:
   - Confirm pre-1929 US or pre-1956 UK publication
   - Check copyright status
   - Verify image authenticity

3. **Update Code**:
   - Replace `image_url` values in `/app/backend/seed_data.py`
   - Use actual historical photos instead of stock images

## Content Accuracy Standards

### Current Approach
- Base all claims on documented historical sources
- Cite sources in biographical data (e.g., "Source: Ronald Hutton")
- Add disclaimers about disputed claims
- Distinguish between verified history and contemporary beliefs

### Sources Used
1. **Ronald Hutton**: "The Triumph of the Moon" (1999) - authoritative history of modern paganism
2. **Philip Heselton**: Gardner biographies with archival research
3. **Alan Richardson**: Dion Fortune biographical works
4. **Leo Ruickbie / Aidan Kelly**: Critical scholarship on Wicca origins
5. **Primary Sources**: Gardner's own writings, Fortune's published works, Crowley's texts

### Disclaimer Language
Added to seed data and UI:
- "Scholarly consensus is skeptical of ancient lineage claims"
- "Based on documented practices from 1910-1945"
- "We focus on what's documented and cite sources honestly"

## Spell Generation Ethics

### AI-Generated Spells
The spell request feature:
1. **Draws from documented practices** of the 1910-1945 period
2. **Cites specific practitioners** (Gardner, Fortune, Crowley, folk traditions)
3. **Distinguishes** between verified historical practice and modern adaptation
4. **Provides sources** for historical elements
5. **Is honest** about what's documented vs. extrapolated

### System Prompt Approach
```
As a historian of 1910-1945 occult practices, help create a spell/ritual...
Provide:
1. A practical spell formula
2. Required materials (historically attested where possible)
3. The ritual steps
4. Historical precedent - cite specific practices
5. Sources/references for the historical elements

Be clear about what is documented vs. modern adaptation.
```

## Future Improvements

### High Priority
1. **Replace all stock photos** with authentic historical images
2. **Add source citations** to every historical claim
3. **Create bibliography page** linking to primary sources
4. **Add "About Our Sources" page** explaining methodology

### Medium Priority
1. **Expand biographical data** with more verified details
2. **Add timeline sources** for each event
3. **Link rituals to primary source texts** where available
4. **Add scholarly articles** to reading list

### Low Priority
1. **User-submitted corrections** feature
2. **Academic review board** for content verification
3. **Integration with academic databases** (JSTOR, etc.)

## Contact for Historical Photos

If implementing photo updates, prioritize:
1. Crowley (easiest - abundant public domain)
2. Yeats (well-documented poet)
3. Gardner (available from 1950s publications)
4. Fortune (hardest - few photos survive)

Remember: All photos must be verified as public domain before use.
