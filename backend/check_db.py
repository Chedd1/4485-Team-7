from sqlmodel import Session, select
from database import dbPost, engine
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def check_database():
    with Session(engine) as session:
        # Check unscored posts
        unscored = session.exec(select(dbPost).where(dbPost.score == None)).all()
        logger.info(f"Unscored posts: {len(unscored)}")
        
        # Check scored posts
        scored = session.exec(select(dbPost).where(dbPost.score != None)).all()
        logger.info(f"Scored posts: {len(scored)}")
        
        # Check posts with score 0
        zero_scored = session.exec(select(dbPost).where(dbPost.score == 0)).all()
        logger.info(f"Posts with score 0: {len(zero_scored)}")
        
        # Print some example posts
        if unscored:
            logger.info("Example unscored post:")
            logger.info(f"ID: {unscored[0].id}")
            logger.info(f"Text: {unscored[0].text[:100]}...")
        
        if scored:
            logger.info("Example scored post:")
            logger.info(f"ID: {scored[0].id}")
            logger.info(f"Text: {scored[0].text[:100]}...")
            logger.info(f"Score: {scored[0].score}")

if __name__ == "__main__":
    check_database() 