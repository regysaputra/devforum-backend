.PHONY: psql ssh

psql:
	psql -U developer -d dev_forum -h localhost

ssh:
	ssh -i "web-server-key.pem" ubuntu@ec2-15-232-28-181.ap-southeast-3.compute.amazonaws.com