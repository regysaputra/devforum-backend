class Thread {
  constructor(payload) {
    const { id, userId, title, body, hotnessScore, createdAt, updatedAt } = payload;
    
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.body = body;
    this.hotnessScore = hotnessScore;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export default Thread;