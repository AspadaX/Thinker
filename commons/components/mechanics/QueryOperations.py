import logging

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class QueryOperation:
    
    def __init__(self, query_object: list) -> None:
        self.query_object = query_object
    
    def __tfidf_cleaner(self, documents, key: str) -> list:
        """
        The function `__tfidf_cleaner` takes a list of documents, calculates the TF-IDF matrix and
        cosine similarity matrix, filters out similar documents based on a similarity threshold, and
        returns a list of unique documents.
        
        :param documents: The `documents` parameter is a list of strings, where each string represents a
        document
        """
        moves: list = [document[key] for document in documents]
        
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(moves)

        # Calculate the cosine similarity matrix
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

        # Set a threshold for filtering similar documents (you can adjust this)
        similarity_threshold = 0.8

        # Filter out similar documents based on the cosine similarity
        unique_doc_indices = []
        for i in range(cosine_sim.shape[0]):
            if all(cosine_sim[i, j] < similarity_threshold or i == j for j in unique_doc_indices):
                unique_doc_indices.append(i)

        # The resulting list of unique documents
        unique_moves: list = [moves[i] for i in unique_doc_indices]
        
        # Retrieve the original dictionaries corresponding to the unique moves
        unique_documents: list = [document for document in documents if document[key] in unique_moves]
        logging.info(f"The number of queries after cleaning: {len(unique_documents)}")

        return unique_documents
    
    def prune_branches(self, key: str) -> list:
        """
        The `prune_branches` function removes duplicate entries from a list of queries based on a
        specified key and then applies a cleaning process using the `__tfidf_cleaner` method.
        
        :param key: The `key` parameter is a string that represents the key in the query object
        dictionary that will be used to determine uniqueness
        :type key: str
        :return: the result of calling the `__tfidf_cleaner` method with the `temporary_query_object` as
        the `documents` parameter.
        """
        
        # the `window` is responsible for collecting unique moves
        window: set = set()
        
        # for storing the processed queries
        temporary_query_object: list = []
        
        # strip away the repeated `move`
        for query in self.query_object:
            if query[key] not in window:
                window.add(query[key])
                temporary_query_object.append(query)
        
        return self.__tfidf_cleaner(documents=temporary_query_object, key=key)