class Token {
    constructor(index, owner){
        this.owner = owner;
        this.id = `token-${index}-${owner.id}`;
        this.dropped = false;
        this.columnLocation = 0;
    }
    
    /** 
     * Gets associated htmlToken.
     * @return  {element}   Html element associated with token object.
     */
    get htmlToken() {
        return document.getElementById(this.id);
    }
    
    /** 
     * Draws new HTML token.
     */
    drawHTMLToken(){
        const token = document.createElement('div');
        document.getElementById('game-board-underlay').appendChild(token);
        token.setAttribute('id', this.id);
        token.setAttribute('class', 'token');
        token.style.backgroundColor = this.owner.color;
    }

    get offsetLeft(){
      return this.htmlToken.offsetLeft
  }

    move (key, columns){
      switch(key) {
        case 'ArrowLeft':
          this.#moveLeft(columns);
          break;
        case 'ArrowRight':
          this.#moveRight(columns);
          break;
          case 'ArrowDown':
            this.#moveDown()
      }
    }
    

  #moveLeft(numOfColumns){
    if(this.columnLocation === 0){
      this.htmlToken.style.left = (numOfColumns-1) * 76;
      this.columnLocation = numOfColumns - 1 ;
    }else {
      this.htmlToken.style.left = this.offsetLeft - 76;
      this.columnLocation -= 1;
    }
  }

  #moveRight(numColumns){
    if(this.columnLocation === numColumns-1){
      this.htmlToken.style.left = 0;
      this.columnLocation = 0;
    }else {
      this.htmlToken.style.left = this.offsetLeft + 76;
      this.columnLocation += 1;
    }
  }

  #moveDown(){
    
  }

  drop(target, reset){
    this.dropped = true
    $(this.htmlToken).animate({
      top: (target.y * target.diameter)
    }, 750, 'easeOutBounce', reset)
  }

}