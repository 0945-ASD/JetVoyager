CREATE TABLE r_user (
	User_ID int AUTO_INCREMENT PRIMARY KEY,
    Name varchar(255),
    NIC varchar(255),
    EMAIL varchar(255),
    PhoneNum int,
    Password varchar(255)
);

CREATE TABLE admin (
    Admin_ID int AUTO_INCREMENT PRIMARY KEY,
    Name varchar(255),
    NIC varchar(255),
    EMAIL varchar(255),
    PhoneNum int,
    Password varchar(255)
);

CREATE table hotel_agent (
    Hotel_ID int AUTO_INCREMENT PRIMARY KEY not null,
    Hotel_name varchar(255),
    Location varchar(255),
    Hotel_phone int
    Hotel_email varchar(255),
    No_of_rooms int ,
    password varchar(255) not null 
);

CREATE table hotel_image (
    Image_ID int AUTO_INCREMENT PRIMARY KEY not null,
    Hotel_ID int,
    Image_path varchar(255),
    FOREIGN KEY (Hotel_ID) REFERENCES hotel_agent(Hotel_ID)
);

create table hotel_details (
    Hotel_ID int AUTO_INCREMENT PRIMARY KEY not null,
    description varchar(255),
    rating int,
    features varchar(255),
    FOREIGN KEY (Hotel_ID) REFERENCES hotel_agent(Hotel_ID)
);

CREATE table hotel_review (
    Review_ID int AUTO_INCREMENT PRIMARY KEY not null,
    Hotel_ID int,
    User_ID int,
    Review varchar(255),
    Rating int,
    FOREIGN KEY (Hotel_ID) REFERENCES hotel_agent(Hotel_ID),
    FOREIGN KEY (User_ID) REFERENCES r_user(User_ID)
);

CREATE table Room_type (
    Hotel_ID int,
    type_id int AUTO_INCREMENT PRIMARY KEY not null,
    Room_price int,
    Room_type enum( 'Single Room', 'Double Room', 'Twin Room', 'Deluxe Room', 
        'Superior Room', 'Suite', 'Junior Suite', 'Executive Suite', 
        'Family Room', 'Studio Room', 'Connecting Rooms', 'Accessible Room', 
        'Penthouse', 'Villa', 'Cabana', 'Bungalow', 
        'Dormitory Room', 'Themed Room', 'Serviced Apartment'),
    FOREIGN KEY (Hotel_ID) REFERENCES hotel_agent(Hotel_ID)
);

CREATE table room (
    Room_ID int AUTO_INCREMENT PRIMARY KEY not null,
    Hotel_ID int,
    type_id int,
    Room_status varchar(255),
    FOREIGN KEY (Hotel_ID) REFERENCES hotel_agent(Hotel_ID),
    FOREIGN KEY (type_id,Hotel_ID) REFERENCES Room_type(type_id,Hotel_ID)
);

CREATE table booking (
    Booking_ID int AUTO_INCREMENT PRIMARY KEY not null,
    User_ID int,
    Room_ID int,
    Check_in_date date,
    Check_out_date date,
    No_of_rooms int,
    Total_price int,
    FOREIGN KEY (User_ID) REFERENCES r_user(User_ID),
    FOREIGN KEY (Room_ID) REFERENCES room(Room_ID)
);

CREATE table contact_form (
    id int AUTO_INCREMENT PRIMARY KEY not null,
    name varchar(255),
    email varchar(255),
    message varchar(255),
    phone int,
    status enum('pending','reviewed','resolved') default 'pending' 
);

CREATE table destination (
    Destination_ID int AUTO_INCREMENT PRIMARY KEY not null,
    Destination_name varchar(255),
    Destination_description varchar(255)
);

CREATE table destination_image (
    Image_ID int AUTO_INCREMENT PRIMARY KEY not null,
    Destination_ID int,
    Image_path varchar(255),
    FOREIGN KEY (Destination_ID) REFERENCES destination(Destination_ID)
);

create table destination_review (
    Review_ID int AUTO_INCREMENT PRIMARY KEY not null,
    Destination_ID int,
    User_ID int,
    Review varchar(255),
    Rating int,
    FOREIGN KEY (Destination_ID) REFERENCES destination(Destination_ID),
    FOREIGN KEY (User_ID) REFERENCES r_user(User_ID)
);

CREATE table destination_hotel (
    Destination_ID int,
    Hotel_ID int,
    FOREIGN KEY (Destination_ID) REFERENCES destination(Destination_ID),
    FOREIGN KEY (Hotel_ID) REFERENCES hotel_agent(Hotel_ID)
);