##################################################################################
# VARIABLES
##################################################################################

variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "cidr_vpc" {}
variable "cidr_subnet1" {}
variable "cidr_subnet2" {}
variable "dbusername" {}
variable "dbpassword" {}
variable "projectname" {}
variable "key_name" {}
variable "az_1" {
  default     = "us-east-1b"
  description = "Your Az1, use AWS CLI to find your account specific"
}
variable "az_2" {
  default     = "us-east-1c"
  description = "Your Az2, use AWS CLI to find your account specific"
}
variable "region" {}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region = var.region
}

resource "aws_vpc" "mediacompanion_vpc" {
  cidr_block = "${var.cidr_vpc}"

  tags = {
    Name = "${var.projectname}-db"
    Environment = "${var.projectname}"
  }
}

resource "aws_subnet" "subnet1" {
  cidr_block = "${var.cidr_subnet1}"
  vpc_id = "${aws_vpc.mediacompanion_vpc.id}"
  availability_zone = "${var.az_1}"

  tags = {
    Name = "${var.projectname}-subnet1"
    Environment = "${var.projectname}"
  }
}

resource "aws_subnet" "subnet2" {
  cidr_block = "${var.cidr_subnet2}"
  vpc_id = "${aws_vpc.mediacompanion_vpc.id}"
    availability_zone = "${var.az_2}"

  tags = {
    Name = "${var.projectname}-subnet2"
    Environment = "${var.projectname}"
  }
}

resource "aws_db_subnet_group" "mediadbsubnet" {
  name = "mediadb-subnet-group"
  subnet_ids = ["${aws_subnet.subnet1.id}", "${aws_subnet.subnet2.id}"]

  tags = {
    Environment = "${var.projectname}"
  }
}

resource "aws_db_instance" "mediadb" {
  allocated_storage = 10
  storage_type = "gp2"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  name = "mediadb"
  username = "${var.dbusername}"
  password = "${var.dbpassword}"

  db_subnet_group_name = "${aws_db_subnet_group.mediadbsubnet.name}"
  multi_az = false
  max_allocated_storage = 100
  skip_final_snapshot = true
  publicly_accessible = true

  tags = {
    Name = "${var.projectname}-dbinstance"
    Environment = "${var.projectname}"
  }
}

resource "aws_eip" "mediaip" {
  instance = "${aws_instance.mediaec2.id}"
  vpc = true
}

resource "aws_instance" "mediaec2" {
  ami = "ami-068663a3c619dd892"
  instance_type = "t2.micro"
  key_name = "${var.key_name}"

  tags = {
    Name = "${var.projectname}-ec2_instance"
    Environment = "${var.projectname}"
  }
}