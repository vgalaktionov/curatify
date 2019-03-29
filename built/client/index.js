"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/first */
const util_1 = __importDefault(require("../lib/util"));
util_1.default();
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const react_dom_1 = __importDefault(require("react-dom"));
const easy_peasy_1 = require("easy-peasy");
const axios_1 = __importDefault(require("axios"));
const spotifyPlayer_1 = __importDefault(require("./spotifyPlayer"));
const Loading_1 = __importDefault(require("./components/Loading"));
const Main_1 = __importDefault(require("./components/Main"));
const store_1 = __importStar(require("./store"));
require("bulma/css/bulma.min.css");
require("bulmaswatch/lux/bulmaswatch.min.css");
require("bulmaswatch/lux/bulmaswatch.min.css");
require("@fortawesome/fontawesome-free/css/all.min.css");
require("./index.css");
spotifyPlayer_1.default();
if (store_1.default.getState().user) {
    setInterval(() => __awaiter(this, void 0, void 0, function* () {
        const { data: user } = yield axios_1.default.get("/auth/me");
        store_1.default.dispatch.user.setUser(user);
    }), 1000 * 5 * 60);
}
function App() {
    const initialFetch = store_1.useActions(actions => actions.user.getUser);
    react_2.useEffect(() => {
        initialFetch();
    }, []);
    const user = store_1.useStore(state => state.user.me);
    return user ? react_1.default.createElement(Main_1.default, null) : react_1.default.createElement(Loading_1.default, null);
}
react_dom_1.default.render(react_1.default.createElement(easy_peasy_1.StoreProvider, { store: store_1.default },
    react_1.default.createElement(App, null)), document.querySelector("#app"));
//# sourceMappingURL=index.js.map