date = message.created_at.localtime.strftime("%m/%d/%Y")
time = message.created_at.localtime.strftime("%I:%M:%S %p")

json.extract! message, :id, :body
json.name message.author.username
json.date date
json.time time