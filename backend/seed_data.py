import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_database():
    # Clear existing data
    await db.deities.delete_many({})
    await db.historical_figures.delete_many({})
    await db.sacred_sites.delete_many({})
    await db.rituals.delete_many({})
    await db.timeline_events.delete_many({})
    
    # Seed Deities
    deities = [
        {
            'id': 'hecate-001',
            'name': 'Hecate',
            'origin': 'Ancient Greek/Anatolian',
            'description': 'Goddess of magic, crossroads, necromancy, and the night. Triple-faced deity associated with the moon and witchcraft.',
            'history': 'Hecate was revived in early 20th century occult practice, particularly through the works of Dion Fortune and Aleister Crowley. Her worship was central to the Hermetic Order of the Golden Dawn and influenced modern Wiccan practice.',
            'associated_practices': ['Moon rituals', 'Crossroads magic', 'Necromancy', 'Protection spells', 'Divination'],
            'image_url': 'https://images.unsplash.com/photo-1711906485337-af335d9810a4?crop=entropy&cs=srgb&fm=jpg&q=85',
            'time_period': '1910-1945'
        },
        {
            'id': 'morrigan-001',
            'name': 'The Morrigan',
            'origin': 'Celtic (Irish)',
            'description': 'Triple goddess of war, fate, and sovereignty. Shape-shifter associated with crows and prophecy.',
            'history': 'The Morrigan experienced renewed interest during the Celtic Revival of the early 20th century. Irish occultists and poets like W.B. Yeats helped revive her worship as a symbol of Irish identity and mystical power.',
            'associated_practices': ['Battle magic', 'Prophecy', 'Shape-shifting rituals', 'Sovereignty rites', 'Crow magic'],
            'image_url': 'https://images.unsplash.com/photo-1745520470002-391193461501?crop=entropy&cs=srgb&fm=jpg&q=85',
            'time_period': '1910-1945'
        },
        {
            'id': 'cerridwen-001',
            'name': 'Cerridwen',
            'origin': 'Celtic (Welsh)',
            'description': 'Goddess of transformation, inspiration, and the cauldron of wisdom. Keeper of the potion of knowledge.',
            'history': 'Cerridwen became central to Druidic revival practices in the 1920s-1940s, particularly in Wales. Her cauldron symbolism was adopted by early Wiccan practitioners as a feminine divine vessel.',
            'associated_practices': ['Potion making', 'Transformation rituals', 'Wisdom seeking', 'Bardic inspiration', 'Cauldron magic'],
            'image_url': 'https://images.unsplash.com/photo-1661619669807-784e46af8029?crop=entropy&cs=srgb&fm=jpg&q=85',
            'time_period': '1910-1945'
        },
        {
            'id': 'arianrhod-001',
            'name': 'Arianrhod',
            'origin': 'Celtic (Welsh)',
            'description': 'Goddess of the silver wheel, fate, and the stars. Guardian of the celestial realm and keeper of destiny.',
            'history': 'Arianrhod gained prominence in 1930s occult circles through the works of Dion Fortune, who incorporated her into ritual work focused on lunar magic and feminine mysteries.',
            'associated_practices': ['Stellar magic', 'Fate weaving', 'Lunar rituals', 'Wheel of the year', 'Initiation rites'],
            'image_url': 'https://images.unsplash.com/photo-1643324896137-f0928e76202a?crop=entropy&cs=srgb&fm=jpg&q=85',
            'time_period': '1910-1945'
        }
    ]
    
    # Seed Historical Figures
    figures = [
        {
            'id': 'gardner-001',
            'name': 'Gerald Gardner',
            'birth_death': '1884-1964',
            'bio': 'British civil servant and amateur anthropologist who founded modern Wicca in the 1940s. Gardner claimed initiation into a surviving witch coven in the New Forest and published the first books on Wiccan practice.',
            'contributions': 'Founded Wicca, wrote "Witchcraft Today" (1954), established the Book of Shadows, created Gardnerian Wicca tradition.',
            'associated_works': ['Witchcraft Today', 'The Meaning of Witchcraft', 'High Magic\'s Aid'],
            'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&q=85'
        },
        {
            'id': 'fortune-001',
            'name': 'Dion Fortune',
            'birth_death': '1890-1946',
            'bio': 'British occultist, ceremonial magician, and novelist. Founded the Society of the Inner Light and was a major figure in the Hermetic Order of the Golden Dawn. Her work bridged psychology and occultism.',
            'contributions': 'Founded Society of the Inner Light, wrote extensively on Western esotericism, developed psychological approach to magic.',
            'associated_works': ['The Mystical Qabalah', 'Psychic Self-Defence', 'The Sea Priestess', 'Moon Magic'],
            'image_url': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=srgb&fm=jpg&q=85'
        },
        {
            'id': 'crowley-001',
            'name': 'Aleister Crowley',
            'birth_death': '1875-1947',
            'bio': 'English occultist, ceremonial magician, and founder of Thelema. One of the most influential figures in 20th century Western esotericism, known for his controversial lifestyle and extensive magical writings.',
            'contributions': 'Founded Thelema, wrote The Book of the Law, reformed Golden Dawn practices, developed system of sex magic.',
            'associated_works': ['The Book of the Law', 'Magick in Theory and Practice', 'The Book of Thoth', '777 and Other Qabalistic Writings'],
            'image_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&q=85'
        },
        {
            'id': 'graves-001',
            'name': 'Robert Graves',
            'birth_death': '1895-1985',
            'bio': 'English poet, novelist, and scholar whose "The White Goddess" (1948) profoundly influenced modern paganism and goddess worship, though written just after our period.',
            'contributions': 'Wrote The White Goddess, revived interest in goddess worship, influenced Wiccan theology.',
            'associated_works': ['The White Goddess', 'The Greek Myths', 'King Jesus'],
            'image_url': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=srgb&fm=jpg&q=85'
        },
        {
            'id': 'yeats-001',
            'name': 'W.B. Yeats',
            'birth_death': '1865-1939',
            'bio': 'Irish poet and occultist, member of the Hermetic Order of the Golden Dawn. His poetry was deeply influenced by Celtic mythology and mystical experiences.',
            'contributions': 'Revived Celtic mythology through poetry, member of Golden Dawn, founded Irish Literary Theatre.',
            'associated_works': ['The Celtic Twilight', 'A Vision', 'The Wild Swans at Coole'],
            'image_url': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&q=85'
        }
    ]
    
    # Seed Sacred Sites
    sites = [
        {
            'id': 'stonehenge-001',
            'name': 'Stonehenge',
            'location': 'Wiltshire, England',
            'country': 'United Kingdom',
            'coordinates': {'lat': 51.1789, 'lng': -1.8262},
            'historical_significance': 'Ancient megalithic monument (c. 3000-2000 BCE) that became a focal point for Druidic revival in the early 20th century. Modern druids held ceremonies here despite restrictions, claiming ancient connection.',
            'time_period': '1910-1945',
            'image_url': 'https://images.unsplash.com/photo-1588578507406-f90d1df22e8e?crop=entropy&cs=srgb&fm=jpg&q=85'
        },
        {
            'id': 'glastonbury-001',
            'name': 'Glastonbury Tor',
            'location': 'Somerset, England',
            'country': 'United Kingdom',
            'coordinates': {'lat': 51.1443, 'lng': -2.6988},
            'historical_significance': 'Sacred hill associated with Arthurian legend and Celtic mysticism. Became center of occult activity in the 1920s-1940s, particularly connected to Dion Fortune\'s work.',
            'time_period': '1910-1945',
            'image_url': 'https://images.unsplash.com/photo-1659016596573-cb626781048a?crop=entropy&cs=srgb&fm=jpg&q=85'
        },
        {
            'id': 'newforest-001',
            'name': 'New Forest',
            'location': 'Hampshire, England',
            'country': 'United Kingdom',
            'coordinates': {'lat': 50.8641, 'lng': -1.6011},
            'historical_significance': 'Ancient woodland where Gerald Gardner claimed to have been initiated into a surviving witch coven in 1939, leading to the creation of modern Wicca.',
            'time_period': '1910-1945',
            'image_url': 'https://images.unsplash.com/photo-1588578507491-879ec69e07d8?crop=entropy&cs=srgb&fm=jpg&q=85'
        },
        {
            'id': 'tara-001',
            'name': 'Hill of Tara',
            'location': 'County Meath, Ireland',
            'country': 'Ireland',
            'coordinates': {'lat': 53.5792, 'lng': -6.6117},
            'historical_significance': 'Ancient seat of Irish High Kings, central to Celtic revival and Irish nationalism in early 20th century. Site of Morrigan worship and sovereignty rituals.',
            'time_period': '1910-1945',
            'image_url': 'https://images.unsplash.com/photo-1585932595938-cceb86652be9?crop=entropy&cs=srgb&fm=jpg&q=85'
        },
        {
            'id': 'externsteine-001',
            'name': 'Externsteine',
            'location': 'Teutoburg Forest, Germany',
            'country': 'Germany',
            'coordinates': {'lat': 51.8677, 'lng': 8.9188},
            'historical_significance': 'Ancient rock formation that became significant to German mysticism and volkisch movements in the 1920s-1940s. Associated with pre-Christian Germanic paganism.',
            'time_period': '1910-1945',
            'image_url': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=srgb&fm=jpg&q=85'
        }
    ]
    
    # Seed Rituals
    rituals = [
        {
            'id': 'ritual-001',
            'name': 'Drawing Down the Moon',
            'description': 'A ritual to invoke the goddess into the high priestess, creating a vessel for divine feminine power. Documented in early 20th century occult literature.',
            'deity_association': 'Hecate, Arianrhod',
            'time_period': '1910-1945',
            'source': 'Hermetic Order of the Golden Dawn, later adopted by Gerald Gardner',
            'category': 'Invocation'
        },
        {
            'id': 'ritual-002',
            'name': 'The Lesser Banishing Ritual of the Pentagram',
            'description': 'Ceremonial magic ritual for protection and purification, widely taught in Golden Dawn lodges and adapted by various occult groups.',
            'deity_association': None,
            'time_period': '1910-1945',
            'source': 'Hermetic Order of the Golden Dawn',
            'category': 'Protection'
        },
        {
            'id': 'ritual-003',
            'name': 'Hecate Supper',
            'description': 'Offerings left at crossroads on the dark moon for Hecate, including bread, eggs, garlic, and honey. Revived from ancient Greek practice.',
            'deity_association': 'Hecate',
            'time_period': '1910-1945',
            'source': 'Dion Fortune\'s Society of the Inner Light',
            'category': 'Offering'
        },
        {
            'id': 'ritual-004',
            'name': 'The Great Rite',
            'description': 'Symbolic or actual ritual of sacred union representing the joining of god and goddess energies. Central to fertility magic.',
            'deity_association': 'Various',
            'time_period': '1910-1945',
            'source': 'Gardnerian Wicca (developed late 1930s-1940s)',
            'category': 'Fertility'
        },
        {
            'id': 'ritual-005',
            'name': 'Cauldron of Cerridwen Meditation',
            'description': 'Transformative ritual involving visualization of Cerridwen\'s cauldron for gaining wisdom and inspiration.',
            'deity_association': 'Cerridwen',
            'time_period': '1910-1945',
            'source': 'Welsh Druidic Revival',
            'category': 'Transformation'
        }
    ]
    
    # Seed Timeline Events
    events = [
        {'id': 'event-001', 'year': 1910, 'title': 'Aleister Crowley publishes early Thelemic works', 'description': 'Crowley begins publishing The Equinox and developing Thelemic philosophy', 'category': 'Publication'},
        {'id': 'event-002', 'year': 1914, 'title': 'WWI Begins - Impact on Occult Movements', 'description': 'World War I disrupts European occult societies but also creates spiritual crisis leading to increased interest', 'category': 'Historical'},
        {'id': 'event-003', 'year': 1922, 'title': 'Dion Fortune founds Society of the Inner Light', 'description': 'Fortune establishes her own magical order after leaving Alpha et Omega', 'category': 'Organization'},
        {'id': 'event-004', 'year': 1925, 'title': 'Margaret Murray publishes The Witch-Cult in Western Europe', 'description': 'Murray\'s controversial thesis about surviving pagan witch cults influences future practitioners', 'category': 'Publication'},
        {'id': 'event-005', 'year': 1929, 'title': 'Dion Fortune publishes The Mystical Qabalah', 'description': 'Foundational text on Western esoteric Qabalah becomes standard reference', 'category': 'Publication'},
        {'id': 'event-006', 'year': 1930, 'title': 'Celtic Revival peaks in Ireland', 'description': 'Renewed interest in Celtic mythology and spirituality tied to Irish independence', 'category': 'Movement'},
        {'id': 'event-007', 'year': 1936, 'title': 'Gerald Gardner travels to Far East', 'description': 'Gardner\'s experiences in Malaya and Ceylon influence his later magical practice', 'category': 'Personal'},
        {'id': 'event-008', 'year': 1939, 'title': 'Gardner claims initiation into New Forest Coven', 'description': 'Gardner allegedly initiated into surviving witch coven by Dorothy Clutterbuck', 'category': 'Initiation'},
        {'id': 'event-009', 'year': 1939, 'title': 'WWII Begins - Occult Response', 'description': 'British occultists including Gardner and Fortune claim magical defense of Britain', 'category': 'Historical'},
        {'id': 'event-010', 'year': 1940, 'title': 'Operation Cone of Power', 'description': 'Alleged magical working by British witches to prevent Nazi invasion', 'category': 'Ritual'},
        {'id': 'event-011', 'year': 1944, 'title': 'Gardner writes High Magic\'s Aid', 'description': 'First book presenting Wiccan-style practices (published 1949)', 'category': 'Publication'},
        {'id': 'event-012', 'year': 1945, 'title': 'End of WWII - New Occult Era Begins', 'description': 'Post-war period sees foundation for modern Wicca and neo-paganism', 'category': 'Historical'}
    ]
    
    # Insert all data
    if deities:
        await db.deities.insert_many(deities)
    if figures:
        await db.historical_figures.insert_many(figures)
    if sites:
        await db.sacred_sites.insert_many(sites)
    if rituals:
        await db.rituals.insert_many(rituals)
    if events:
        await db.timeline_events.insert_many(events)
    
    print('Database seeded successfully!')
    client.close()

if __name__ == '__main__':
    asyncio.run(seed_database())
