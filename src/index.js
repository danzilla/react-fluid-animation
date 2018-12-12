import React, { Component } from 'react'
import PropTypes from 'prop-types'

import raf from 'raf'
import sizeMe from 'react-sizeme'

import FluidAnimation from './fluid-animation'

class ReactFluidAnimation extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    style: PropTypes.object,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  }

  static defaultProps = {
    style: { }
  }

  componentWillReceiveProps(props) {
    this._onResize()
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize)
    this._reset(this.props)
    this._tick()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize)
    if (this._tickRaf) {
      raf.cancel(this._tickRaf)
      this._tickRaf = null
    }
  }

  render() {
    const {
      content,
      style,
      size,
      ...rest
    } = this.props

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          ...style
        }}
        {...rest}
        ref={this._containerRef}
      >
        <canvas
          ref={this._canvasRef}
          onMouseDown={this._onMouseDown}
          onMouseMove={this._onMouseMove}
          onMouseUp={this._onMouseUp}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    )
  }

  _containerRef = (ref) => {
    this._container = ref
  }

  _canvasRef = (ref) => {
    this._canvas = ref
  }

  _onMouseDown = (event) => {
    event.preventDefault()
    this._animation.onMouseDown(event.nativeEvent)
  }

  _onMouseMove = (event) => {
    event.preventDefault()
    this._animation.onMouseMove(event.nativeEvent)
  }

  _onMouseUp = (event) => {
    event.preventDefault()
    this._animation.onMouseUp(event.nativeEvent)
  }

  _onResize = () => {
    this._canvas.width = this._container.clientWidth
    this._canvas.height = this._container.clientHeight

    if (this._animation) {
      this._animation.resize()
    }
  }

  _tick = () => {
    if (this._animation) {
      this._animation.update()
    }

    this._tickRaf = raf(this._tick)
  }

  _reset(props) {
    const {
      content
    } = props

    this._onResize()

    this._animation = new FluidAnimation({
      canvas: this._canvas,
      content
    })
  }
}

export default sizeMe({ monitorWidth: true, monitorHeight: true })(ReactFluidAnimation)
