
import 'file-loader?name=[name].[ext]!extract-loader!@root/src/templates/rates.html';
import '@css/rates/main.scss';

// standalone
import '!file-loader?name=./standalone_env/[name].[ext]!./standalone_env/jquery.min.js';
import '!file-loader?name=./standalone_env/[name].[ext]!./standalone_env/jquery-ui.min.js';
import '!file-loader?name=./standalone_env/[name].[ext]!./standalone_env/react.js';
import '!file-loader?name=./standalone_env/[name].[ext]!./standalone_env/react-dom.js';
import '!file-loader?name=./standalone_env/[name].[ext]!./standalone_env/react-bootstrap.min.js';
import '!file-loader?name=./standalone_env/[name].[ext]!./standalone_env/init.js';

import '!file-loader?name=./standalone_env/[name].[ext]!@css/rates/bootstrap.min.css';

import format from 'string-format';
format.extend(String.prototype);

import './rates/index_standalone';
