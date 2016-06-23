bake in code splitting
create new theme
move mainlayout to routes.jsx
rewrite auth reducer when rewriting user system
create multi-tenant system
	school registration
		school name
		username -> auto generated//read only field//user can edit//must be one word//represents eg. knust.emule.com
		password(generate password for institution button)
		logo
	choose plan(based on number of clients)
	payment details(bank debit cards and credit cards...) free for 2 weeks after which billing begins
	create database based on school name
	on connection to server...if client is a subdomain..ie school account?connect to school db if not serve project default homepage

Create admin system for school
	add books
	user authentication -> We'll choose which to implement
		option 1:
		add authentication url which returns users in format({username, avatar, studentId, fullName...others})
			authentication url is used to authenticate users of school and generate jwt tokens to authenticate them with our backend
		option 2:
			send signup/invite links to users/students by phone/email -> choose
			users register by invites into application so we can authenticate them ourselves
	admin add lecturers/tutors

Lecturer admin functions
	create course list for various semesters
	create further reading lists for each semester
	request book
	add book(mostly pdfs...free books)

student use cases
	choose course, semester, programme
	get reading list and recommended readings
	search for books
	read books online
	save books for offline reading -> mobile app
	
dictionary searches
jargons

Job description
Online elibrary platform
	Students choose course, year, semester and gets reading list and further readings for semester courses
	Pdfs - pdf reader in application...pdfs can be saved and read in application but shouldn't be made downloadable sake of copyright reasons
	Link with library system to show if book exists for borrowing - If library system exists
	students login with university credentials
	administrator login for management purposes, lecturers should also possibly be allowed to manage their course catalogs for the semesters
	search for a book in library, by college, course, semester, etc
	advanced search by publisher, author, keywords, published date, etc..
	research support. How to go about research..
	library blog...news stuff
	library searches should also include google scholar searches, dictionary meanings...etc..as from these list of hosts which myt provide api to interact with their data.
		Academic Search Premier (EBSCOhost)
		Business Source Complete (EBSCOhost)
		Google Scholar
		JSTOR
		LexisNexis Academic
		MLA Int'l Bibliography (EBSCOhost)
		Oxford English Dictionary, 3rd Edition
		ProQuest Dissertations and Theses
		PsycINFO (EBSCOhost)
		PubMed (MEDLINE)
		Web of Science
		WorldCat (FirstSearch)
SRC president communicates back that the payment will be after the delivery of the product. We would prepare an invoice with a company name..and whatever our charges are. and that the university pays only after delivery not before product is done.
And based on your availability..He wants to meet with us in the course of next week.


 Create a book class with a title, page count, ISBN and whether or not it is checked out or not. Manage a collection of various books and allow the user to check out books or return books. For added complexity generate a report of those books overdue and any fees. Also allow users to put books on reserve.

system admin
	add a book
		related
		name
		oisbn
		publisher
		appliedFields[keys eg...computing, medicine, pharmacy, etc]
		server
			process book thumbnail
			add book thumbnail

external admin(schools)
register institution - get unique institution id
select plan
	below 5000 students
	below 20000 students
	above 40000 students
pluggable authentication system
 external url(auth url)
 	return fields
 		username
 		avatarurl
 		fullname
 		studentId
 		studentReference
 request a book
 	author
 	isbn
 	publisher
pluggable library system
	library search end //url
	library reserve book end
add lecturer

lecturers
	request books
	suggest a book(mostly lecturer written books...providing pdfs for each)
	prepare book lists for students by
		course (field)
		year
		semester
 		department

all users
	search for a book based on
		isbn
		publisher
		book name
		published date
		keywords
	read a book
	download a book(if copyrights allow)

Tools
	Server: AWS EC2
	storage: AWS S3


[tenant].emule.com eg knust.emule.com
	KNUST is supposed to manage everything for his platform