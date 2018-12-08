import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import Draggable from 'react-draggable';


class App extends Component {
  eventLogger = (e: MouseEvent, data: Object) => {
    console.log('Event: ', e);
    console.log('Data: ', data);
  };
  handleDrag(e, ui){
    console.log(ui.x, ui.y);
    console.log(this.name);
  }
  render() {
    return (
      <div>
      <Draggable
        handle=".handle"
        defaultPosition={{x: 0, y: 0}}
        position={null}
        grid={[50, 50]}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        name="Time_widget">
        <div>
          <div className="handle">Drag from here</div>
          <div>This readme is really dragging on...</div>
        </div>
      </Draggable>
      <Draggable
        handle=".handle"
        defaultPosition={{x: 50, y: 50}}
        position={null}
        grid={[50, 50]}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        name="OtherWidget">
        <div>
          <div className="handle">Drag from here</div>
          <div>This readme is really dragging on...</div>
        </div>
      </Draggable>
      <div id="qwe">
        <h1>HUEELLE</h1>
      </div>
      {/*<Draggable
        onDrag={this.handleDrag}>
          <div className="box">
            <div>I track my deltas</div>
            <div>x: {deltaPosition.x.toFixed(0)}, y: {deltaPosition.y.toFixed(0)}</div>
          </div>
      </Draggable>*/}
      </div>
    );
  }
}

export default App;
