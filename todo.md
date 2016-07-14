transitions
code igniter
do email sending
do sms sending
do types of blog posts
add all to gnaas
redo gallery page rendering
search engine optimization

setup caching layer -> redis
setup cloudfront - also for apfs2017 domain => done => finish cname setup

Slowdns for android

vodafone x with tunnelguru on pc slow dns on android

Tunnelguru for pc
[9:05 AM, 7/4/2016] +233 54 158 4137: bi ebi dns trick
[9:05 AM, 7/4/2016] +233 54 158 4137: Works with airtel

* open sans
* test page without javascript
* make sure webpack builds the minimum file size
* create user system
* create new theme
* create multi-tenant system
	school registration
		school name
		username -> auto generated//read only field//user can edit//must be one word//represents eg. knust.emule.com
		password(generate password for institution button)
		logo
	choose plan(based on number of clients)
	payment details(bank debit cards and credit cards...) free for 2 weeks after which billing begins
	create database based on school name
	on connection to server...if client is a subdomain..ie school account?connect to school db if not serve project default homepage


> Create admin system for school
	add books
	user authentication -> We'll choose which to implement
		option 1:
		add authentication url which returns users in format({username, avatar, studentId, fullName...others})
			authentication url is used to authenticate users of school and generate jwt tokens to authenticate them with our backend
		option 2:
			send signup/invite links to users/students by phone/email -> choose
			users register by invites into application so we can authenticate them ourselves
	admin add lecturers/tutors



> Lecturer admin functions
	create course list for various semesters
	create further reading lists for each semester
	request book
	add book(mostly pdfs...free books)


> student use cases
	choose course, semester, programme
	get reading list and recommended readings
	search for books
	read books online
	save books for offline reading -> mobile app
	


> Searching will include
	dictionary searches
	jargons