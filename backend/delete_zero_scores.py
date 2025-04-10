from database import delete_posts_with_zero_score

def main():
    print("Deleting posts with a score of 0...")
    deleted_count = delete_posts_with_zero_score()
    print(f"Successfully deleted {deleted_count} posts with a score of 0.")

if __name__ == "__main__":
    main() 