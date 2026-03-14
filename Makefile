.PHONY: psql ssh

psql:
	psql -U developer -d dev_forum -h localhost

ssh:
	ssh -i "web-server-key.pem" ubuntu@ec2-43-218-226-201.ap-southeast-3.compute.amazonaws.com