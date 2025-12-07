"""Test script for RAG Chatbot API endpoints"""
import requests
import json
from typing import Optional

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_ask_question(query: str):
    """Test ask endpoint with a general question"""
    print(f"\n=== Testing /ask Endpoint ===")
    print(f"Query: {query}")

    payload = {
        "query": query,
        "selected_text": None,
        "top_k": 5
    }

    try:
        response = requests.post(
            f"{BASE_URL}/ask",
            json=payload,
            timeout=30
        )
        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"\nAnswer:\n{data['answer']}")

            if data.get('sources'):
                print("\nSources:")
                for i, source in enumerate(data['sources'], 1):
                    print(f"  {i}. {source['url']}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def test_ask_selected_text(query: str, selected_text: str):
    """Test ask endpoint with selected text"""
    print(f"\n=== Testing /ask-selected-text Endpoint ===")
    print(f"Query: {query}")
    print(f"Selected Text: {selected_text[:100]}...")

    payload = {
        "query": query,
        "selected_text": selected_text,
        "top_k": 5
    }

    try:
        response = requests.post(
            f"{BASE_URL}/ask-selected-text",
            json=payload,
            timeout=30
        )
        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"\nAnswer:\n{data['answer']}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def run_all_tests():
    """Run all chatbot tests"""
    print("=" * 60)
    print("RAG CHATBOT API TEST SUITE")
    print("=" * 60)

    results = {}

    # Test 1: Health check
    results['health'] = test_health()

    if not results['health']:
        print("\n❌ Health check failed. Make sure API server is running.")
        print("Start it with: python -m uvicorn api_server:app --reload")
        return

    print("\n✅ Health check passed. Continuing with functional tests...")

    # Test 2: General question
    results['general_question'] = test_ask_question(
        "What is ROS2 and why is it important for robotics?"
    )

    # Test 3: Another general question
    results['technical_question'] = test_ask_question(
        "Explain the concept of humanoid robots"
    )

    # Test 4: Selected text question
    sample_selected_text = """
    Humanoid robots are robots designed to mimic the human form and behavior.
    They typically have a head, torso, two arms, and two legs, allowing them
    to interact with environments built for humans.
    """

    results['selected_text'] = test_ask_selected_text(
        "Can you explain what this text is saying?",
        sample_selected_text
    )

    # Print summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)

    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")

    total = len(results)
    passed = sum(1 for v in results.values() if v)
    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! The chatbot API is working correctly.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the output above for details.")

if __name__ == "__main__":
    print("\nMake sure the FastAPI server is running:")
    print("  python -m uvicorn api_server:app --reload\n")

    input("Press Enter to start tests...")
    run_all_tests()
