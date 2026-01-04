import requests
import sys
import json
from datetime import datetime

class SpiritualAppAPITester:
    def __init__(self, base_url="https://diywizardry.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                try:
                    return False, response.json()
                except:
                    return False, response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            return False, {}

    def test_auth_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test User {timestamp}"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and isinstance(response, dict) and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_auth_login(self):
        """Test user login with existing credentials"""
        # Try to login with the registered user
        if not hasattr(self, 'test_email'):
            return False
            
        login_data = {
            "email": self.test_email,
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST", 
            "auth/login",
            200,
            data=login_data
        )
        
        if success and isinstance(response, dict) and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_get_deities(self):
        """Test getting all deities"""
        success, response = self.run_test(
            "Get All Deities",
            "GET",
            "deities",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} deities")
            if len(response) > 0:
                # Test getting a specific deity
                deity_id = response[0].get('id')
                if deity_id:
                    self.test_get_deity(deity_id)
            return True
        return False

    def test_get_deity(self, deity_id):
        """Test getting a specific deity"""
        success, response = self.run_test(
            f"Get Deity {deity_id}",
            "GET",
            f"deities/{deity_id}",
            200
        )
        return success

    def test_get_historical_figures(self):
        """Test getting all historical figures"""
        success, response = self.run_test(
            "Get All Historical Figures",
            "GET",
            "historical-figures",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} historical figures")
            if len(response) > 0:
                # Test getting a specific figure
                figure_id = response[0].get('id')
                if figure_id:
                    self.test_get_figure(figure_id)
            return True
        return False

    def test_get_figure(self, figure_id):
        """Test getting a specific historical figure"""
        success, response = self.run_test(
            f"Get Historical Figure {figure_id}",
            "GET",
            f"historical-figures/{figure_id}",
            200
        )
        return success

    def test_get_sacred_sites(self):
        """Test getting all sacred sites"""
        success, response = self.run_test(
            "Get All Sacred Sites",
            "GET",
            "sacred-sites",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} sacred sites")
            if len(response) > 0:
                # Test getting a specific site
                site_id = response[0].get('id')
                if site_id:
                    self.test_get_site(site_id)
            return True
        return False

    def test_get_site(self, site_id):
        """Test getting a specific sacred site"""
        success, response = self.run_test(
            f"Get Sacred Site {site_id}",
            "GET",
            f"sacred-sites/{site_id}",
            200
        )
        return success

    def test_get_rituals(self):
        """Test getting all rituals and filtering by category"""
        success, response = self.run_test(
            "Get All Rituals",
            "GET",
            "rituals",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} rituals")
            
            # Test filtering by category
            categories = ['Invocation', 'Protection', 'Offering']
            for category in categories:
                self.run_test(
                    f"Get Rituals - {category}",
                    "GET",
                    f"rituals?category={category}",
                    200
                )
            
            if len(response) > 0:
                # Test getting a specific ritual
                ritual_id = response[0].get('id')
                if ritual_id:
                    self.test_get_ritual(ritual_id)
            return True
        return False

    def test_get_ritual(self, ritual_id):
        """Test getting a specific ritual"""
        success, response = self.run_test(
            f"Get Ritual {ritual_id}",
            "GET",
            f"rituals/{ritual_id}",
            200
        )
        return success

    def test_get_timeline(self):
        """Test getting timeline events"""
        success, response = self.run_test(
            "Get Timeline Events",
            "GET",
            "timeline",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} timeline events")
            return True
        return False

    def test_get_archetypes(self):
        """Test getting all archetypes"""
        success, response = self.run_test(
            "Get All Archetypes",
            "GET",
            "archetypes",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} archetypes")
            expected_archetypes = ['shiggy', 'kathleen', 'catherine', 'theresa']
            found_ids = [archetype.get('id') for archetype in response]
            
            for expected in expected_archetypes:
                if expected in found_ids:
                    print(f"   ✅ Found archetype: {expected}")
                else:
                    print(f"   ❌ Missing archetype: {expected}")
                    return False
            
            return len(response) == 4
        return False

    def test_ai_chat_neutral(self):
        """Test AI chat without archetype (neutral persona)"""
        chat_data = {
            "message": "Create a simple protection spell for my home"
        }
        
        success, response = self.run_test(
            "AI Chat - Neutral Persona",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            print(f"   AI Response length: {len(response['response'])} characters")
            # Check that no archetype was used
            if response.get('archetype') is None:
                print("   ✅ Neutral persona used (no archetype)")
                return True
            else:
                print(f"   ❌ Expected neutral, got archetype: {response.get('archetype')}")
                return False
        return False

    def test_ai_chat_shiggy(self):
        """Test AI chat with Shiggy archetype"""
        chat_data = {
            "message": "I need courage for a difficult conversation with my family",
            "archetype": "shiggy"
        }
        
        success, response = self.run_test(
            "AI Chat - Shiggy Archetype",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            ai_response = response['response'].lower()
            print(f"   AI Response length: {len(response['response'])} characters")
            
            # Check for Shiggy-specific elements
            shiggy_indicators = ['poetry', 'courage', 'bird', 'omen', 'rubáiyát', 'practical', 'daily practice']
            found_indicators = [indicator for indicator in shiggy_indicators if indicator in ai_response]
            
            if found_indicators:
                print(f"   ✅ Shiggy persona detected - found: {', '.join(found_indicators)}")
                return True
            else:
                print(f"   ❌ Shiggy persona not detected in response")
                print(f"   Response preview: {response['response'][:200]}...")
                return False
        return False

    def test_ai_chat_kathleen(self):
        """Test AI chat with Kathleen archetype"""
        chat_data = {
            "message": "Help me protect family secrets while healing old wounds",
            "archetype": "kathleen"
        }
        
        success, response = self.run_test(
            "AI Chat - Kathleen Archetype",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            ai_response = response['response'].lower()
            print(f"   AI Response length: {len(response['response'])} characters")
            
            # Check for Kathleen-specific elements
            kathleen_indicators = ['secret', 'protection', 'resilience', 'family', 'document', 'photograph', 'veil', 'guard']
            found_indicators = [indicator for indicator in kathleen_indicators if indicator in ai_response]
            
            if found_indicators:
                print(f"   ✅ Kathleen persona detected - found: {', '.join(found_indicators)}")
                return True
            else:
                print(f"   ❌ Kathleen persona not detected in response")
                print(f"   Response preview: {response['response'][:200]}...")
                return False
        return False

    def test_ai_chat(self):
        """Test AI chat functionality"""
        chat_data = {
            "message": "Tell me about Hecate in the context of 1910-1945 occult revival"
        }
        
        success, response = self.run_test(
            "AI Chat",
            "POST",
            "ai/chat",
            200,
            data=chat_data
        )
        
        if success and isinstance(response, dict) and 'response' in response:
            print(f"   AI Response length: {len(response['response'])} characters")
            return True
        return False

    def test_ai_image_generation(self):
        """Test AI image generation"""
        image_data = {
            "prompt": "Hecate at a moonlit crossroads"
        }
        
        success, response = self.run_test(
            "AI Image Generation",
            "POST",
            "ai/generate-image",
            200,
            data=image_data
        )
        
        if success and isinstance(response, dict) and 'image_base64' in response:
            print(f"   Image generated successfully (base64 length: {len(response['image_base64'])})")
            return True
        return False

    def test_favorites(self):
        """Test favorites functionality (requires authentication)"""
        if not self.token:
            print("⚠️  Skipping favorites test - no authentication token")
            return False
            
        # Add a favorite
        favorite_data = {
            "item_type": "deity",
            "item_id": "test-deity-id"
        }
        
        success, response = self.run_test(
            "Add Favorite",
            "POST",
            "favorites",
            200,
            data=favorite_data
        )
        
        if success:
            # Get favorites
            self.run_test(
                "Get Favorites",
                "GET",
                "favorites",
                200
            )
            
            # Remove favorite
            self.run_test(
                "Remove Favorite",
                "DELETE",
                "favorites",
                200,
                data=favorite_data
            )
            
        return success

def main():
    print("🧙‍♀️ Starting Spiritual App API Testing...")
    print("=" * 60)
    
    # Setup
    tester = SpiritualAppAPITester()
    
    # Test authentication first
    print("\n📝 Testing Authentication...")
    if not tester.test_auth_register():
        print("❌ Registration failed, continuing with other tests...")
    
    # Test archetype system (priority tests from review request)
    print("\n🎭 Testing Archetype System...")
    tester.test_get_archetypes()
    
    # Test all content endpoints (these should work without auth)
    print("\n🌙 Testing Content APIs...")
    tester.test_get_deities()
    tester.test_get_historical_figures()
    tester.test_get_sacred_sites()
    tester.test_get_rituals()
    tester.test_get_timeline()
    
    # Test AI features with archetype personas
    print("\n🤖 Testing AI Features...")
    tester.test_ai_chat_neutral()
    tester.test_ai_chat_shiggy()
    tester.test_ai_chat_kathleen()
    tester.test_ai_chat()  # Keep original test for backward compatibility
    tester.test_ai_image_generation()
    
    # Test favorites (requires auth)
    print("\n⭐ Testing Favorites...")
    tester.test_favorites()
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure.get('test', 'Unknown')}: {failure}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n🎯 Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate > 80 else 1

if __name__ == "__main__":
    sys.exit(main())