<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Speech Bubbler</title>
  </head>
  <body>
    <!--TODO add emojis -->
    <!--TODO embed web fonts -->
    <!--TODO accept feedback -->
    <!--TODO 全角半角対応-->
    <!--TODO 最後の単語をダブルクリックで選択したときの挙動-->
    <!--TODO センテンス全体をダブルクリックで選択したときの挙動-->
    <h1>Speech Bubbler</h1>
    <p>
    Select string and click
    <button style="pointer-events: none;">
      Add Speech Bubble
    </button>
    button below.<br>
    if you think this is broken, change your font settings.
    </p>

    <div>
      <input bind:value={theString} id="input_field" name="input_field">
    </div>

    <div>
      <pre role="img">
        <code>
{str}
{result}
{theString}
        </code>
      </pre>
    </div>

    <div>
      <button on:click={buttonClicked}>Add Speech Bubble</button>
      <button on:click={clear}>clear</button>
    </div>

    <ul>
      {#each $slices as slice, index}
        <li>{index} - {slice}</li>
      {/each}
    </ul>

    <hr>

    <p>example</p>

    <div>
      <p>
        <img src="./src/example1.png" alt="example1" height="200">
      </p>
    </div>

  </body>
</html>

<script>
  import { slices } from './stores.js';
  let theString = "put text to edit here."
  let str = ''
  let result = ''

  function buttonClicked() {  // {{{
      let sel = window.getSelection()
      // TODO ensure sel is on theString
      let range = getRange(sel)
      if (range[0] != range[1]) {
          handleSlices(range)
          generateResult()
        }
    }  // }}}

  function getRange(sel) {  // {{{
      let an = sel.anchorOffset
      let fo = sel.focusOffset
      return an < fo ? [an, fo] : [fo, an]
    }  // }}}

  function clear() {  // {{{
      slices.reset()
      str = ''
      result = ''
    }  // }}}

  function handleSlices(range) {  // {{{
      let will_overlap = $slices.some(_range => overlap(_range, range))
      if (!will_overlap) {
        slices.push(range)
        slices.sort()
      } else {
        console.warn('overlapping')
      }
    }  // }}}

  function overlap(range1, range2) {  // {{{
      if (range1[1] <= range2[0] || range1[0] >= range2[1]){
          return false
        }
      return true
    }  // }}}

  function generateResult() {  // {{{
      result = ''
      let starts = []
      let ends = []
      for (const i of $slices) {
          starts.push(i[0])
          ends.push(i[1]-1)
        }
      var mode = ' '
      for (let pos=0; pos < theString.length; pos++) {
          if (starts.includes(pos) && ends.includes(pos)) {
              result += String.fromCodePoint(0x2502)  // '│'
              continue
            }
          if (starts.includes(pos)) {
              result += String.fromCodePoint(0x250C)  // '┌'
              mode = String.fromCodePoint(0x2500)     // '─'
              continue
            }
          if (ends.includes(pos)) {
              result += String.fromCodePoint(0x2524)  // '┤'
              mode = '\u00A0'                         // ' '
              continue
            }
          result += mode
      }
      starts.shift()
      let streamers = []
      for (let i=0; i <= starts.length; i++) {
          var stream = ''
          for (let j=0; j < ends[i]; j++) {
              if (ends.includes(j)) {
                  stream += String.fromCodePoint(0x2502)  // '│'
                }
              else {
                  stream += '\u00A0'                      // ' '
                }
            }
          stream += String.fromCodePoint(0x250C)          // '┌'
          stream += String.fromCodePoint(0x2500)          // '─'
          for (let j=0; j < (ends.slice(-1)[0]-ends[i]); j++) {
              stream += String.fromCodePoint(0x2500)      // '─'
            }
          streamers.push(stream)
        }
      str = streamers.join('\n')
      // console.log($slices)
      // console.log(str)
      // console.log(result)
    }  // }}}
</script>

<style>
    pre {
      white-space: pre-wrap ;
      font: "Roboto Mono";
    }

    body {
        text-align: left;
        padding: 1em;
        max-width: 600px;
        margin: 0 auto;
    }

    body > div > input {
        margin: 0.5em auto;
        width: 90%;
        box-sizing: border-box;
    }

    hr {
      align-self: center;
      margin-top:2em;
      margin-bottom:2em;
      width: 80%;
    }
</style>
