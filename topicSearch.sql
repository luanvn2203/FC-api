SELECT * FROM `flashcard-management`.tbl_topic;

CREATE FULLTEXT INDEX SEARCH_TOPIC_NAME
ON tbl_topic(topicName)

SELECT * FROM tbl_topic WHERE MATCH (topicDescription) AGAINST ('this is all' WITH QUERY EXPANSION);

SELECT * FROM tbl_topic WHERE MATCH (topicName,topicDescription) AGAINST ('OOP Design' WITH QUERY EXPANSION) and statusId = 1;
-------------------------
select* from tbl_subject
CREATE FULLTEXT INDEX SEARCH_SUBJECT
ON tbl_subject(subjectName,subjectDescription)

SELECT *
FROM tbl_subject WHERE MATCH (subjectName,subjectDescription) AGAINST ('Test Subject 1aaa'  )
and statusId = 1  ;
-----------------------------------
select* from tbl_lession
CREATE FULLTEXT INDEX SEARCH_LESSION
ON tbl_lession(lessionName,lessionDescription)

SELECT distinct subjectId FROM tbl_lession WHERE MATCH (lessionName,lessionDescription) AGAINST ('chapter 1' ) and statusId = 1;

select * from tbl_lession where lessionName like '%chapter 12%' or lessionDescription like '%chapter 12%' and
MATCH (lessionName,lessionDescription) AGAINST ('chapter 12' ) and statusId = 1

//search lession
select  s.subjectId,  s.subjectName,  s.accountId,  s.topicId,  s.subjectDescription,  s.createdDate,  s.statusId, a.fullName as author
from tbl_subject s, tbl_account a where s.accountId = a.email and subjectId in (SELECT distinct subjectId FROM tbl_lession 
WHERE MATCH (lessionName,lessionDescription) AGAINST ('chapter 1'WITH QUERY EXPANSION ) and statusId = 1)


//search flashcard
CREATE FULLTEXT INDEX SEARCH_FLASHCARD
ON tbl_flashcards(flashcardName)

select s.subjectId,  s.subjectName,  s.accountId,  s.topicId,  s.subjectDescription,  s.createdDate,  s.statusId, a.fullName as author
from tbl_subject s, tbl_account a where s.accountId = a.email and subjectId 
in (select distinct subjectId from tbl_lession where lessionId in 
(select distinct lessionId from tbl_flashcards where MATCH (flashcardName) AGAINST ('vocabularies' WITH QUERY EXPANSION) and statusId = 1))


//search question
CREATE FULLTEXT INDEX SEARCH_QUESTION
ON tbl_question(questionContent)

select  s.subjectId,  s.subjectName,  s.accountId,  s.topicId,  s.subjectDescription,  s.createdDate,  s.statusId, a.fullName
from tbl_subject s, tbl_account a where s.accountId = a.email and s.subjectId 
in (select distinct subjectId from tbl_lession where lessionId 
in (select distinct lessionId from tbl_flashcards where flashcardId 
in (select distinct flashcardId from tbl_question where 
MATCH (questionContent) AGAINST ('mean' WITH QUERY EXPANSION) and statusId = 1)))



