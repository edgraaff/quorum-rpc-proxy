# Web3 RPC proxy for Quorum

Test project that serves a RPC proxy. When RAFT consensus is used, the timestamps of blocks (in nanoseconds) are too big for a JavaScript number. This proxy converts these timestamps to seconds.

# Usage

*   Install dependencies

    ```sh
    npm install
    ```

*   Configure by editing `config.js`. Set `rpcUrl` to the RPC URL you would like to proxy to. Set `port` to any available port.

*   Start server

    ```sh
    npm run start
    ```