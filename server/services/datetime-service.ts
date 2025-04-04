import { subscribeTo$ } from "../../shared/element.min.js";
import { onGET } from "../datetime.ts";

// This subscribes to API requests for the datetime endpoint
subscribeTo$('RetrieveDatetime', async (_query, ctx) => {
    try {
        // Extract the datetime value directly
        return { subject: 'DatetimeRetrieved', data: { datetime: new Date().toLocaleString() } };
    }
    catch (e) {
        return { subject: 'Exception', data: { error: e.message } };
    }
});
