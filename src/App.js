import { useRef, useState } from 'react';
import './App.css';
import BasePointerTag from './BasePointerTag';
import StackPointerTag from './StackPointerTag';

function App() {

  const [startAddr, setStartAddr] = useState(1000);
  const [stackVals, setStackVals] = useState([]);
  const [ebp, setEbp] = useState(0); // the offset of the ebp pointer from the base pointer
  const [esp, setEsp] = useState(0); // the offset of the esp pointer from the base pointer

  const valueRef = useRef();
  const sizeRef = useRef();

  function pushStackVal(bytes, val) {

    setStackVals([...stackVals, {
      size: bytes,
      value: val,
      offset: esp - bytes,
    }]);
    setEsp(esp - bytes);
  }

  function popStackVal() {
    setStackVals(stackVals.slice(0, stackVals.length - 1));
    setEsp(esp + 4);
  }

  window.stackVals = stackVals;

  function getStackRows() {
    let components = [...stackVals].reverse().map((val, index) => {
      let address = startAddr + ebp + val.offset;
      return (
        <tr>
          <td>
            <div className="d-flex gap-2">
              { startAddr + ebp === address &&
                <BasePointerTag/>
              }
              { startAddr + esp === address &&
                <StackPointerTag/>
              }
            </div>
          </td>
          <th scope="row">0x{address}</th>
          <td>{val.value}</td>
        </tr>
      )
    });
    return components;
  }

  return (
    <div className="App">
      <div className="column table-column">

        <div className="card h-100">
            <div className="card-body">

            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Addr</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <th scope="row">--</th>
                  <td>--</td>
                </tr>
                {getStackRows()}
                <tr className="table-row">
                  <td>
                    <div className="d-flex gap-2">
                      { ebp === 0 &&
                        <BasePointerTag/>
                      }
                      { esp === 0 &&
                        <StackPointerTag/>
                      }
                    </div>
                  </td>
                  <th scope="row" className="position-relative">
                    0x{startAddr}
                  </th>
                  <td>*ret_address</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

      </div>
      <div className="column">

        <div className="card w-100">
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label for="startAddr" className="form-label">Start Address</label>
                <div class="input-group">
                  <div class="input-group-text">0x</div>
                  <input type="number" className="form-control" id="startAddr" value={startAddr} onChange={(e) => setStartAddr(e.target.value)} />
                </div>
              </div>
              <hr/>
              <div className="row mb-3">
                <div className="col-9">
                  <label for="value" className="form-label">Value</label>
                  <input type="text" className="form-control" id="value" ref={valueRef} />
                </div>
                <div className="col-3">
                  <label for="size" className="form-label">Size</label>
                  <input type="number" className="form-control" id="size" ref={sizeRef} />
                </div>
              </div>
              <div className="d-flex">
                <button type="button" className="btn btn-primary me-2" onClick={() => pushStackVal(sizeRef.current.value, valueRef.current.value)}>Push</button>
                <button type="button" className="btn btn-primary" onClick={() => popStackVal()}>Pop</button>
              </div>
              <div className="d-flex mt-2">
                <button type="button" className="btn btn-secondary me-2" onClick={() => {
                  setEbp(esp);
                }}>%ebp → %esp</button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setEsp(ebp);
                }}>%esp → %ebp</button>
              </div>
            </form>
          </div>
        </div>

        <div className="card w-100 mt-3">
          <div className="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Caller Should Save</th>
                  <th scope="col">Callee Should Save</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>%eax</td>
                  <td>%ebx</td>
                </tr>
                <tr>
                  <td>%ecx</td>
                  <td>%ebp</td>
                </tr>
                <tr>
                  <td>%edx</td>
                  <td>%esi</td>
                </tr>
                <tr>
                  <td>----</td>
                  <td>%edi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
