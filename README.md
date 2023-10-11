# Github search assignment

## The assignment
The first page should have a search bar, filters for narrowing down the search, and a container to display the search results. The results should be sortable based on the following stats: stars and forks. The search bar should check if the input text is contained in any of the following: name, description, topics, or readme. Additional search parameters should include the number of followers, number of stars, and language.
The second page should list the history of searched items. Clicking on any of them should trigger the display of the same first 10 results.

## How to run?
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open your browser and go to the localhost URL given in your terminal

### Github limits
Though Github offers the possibility to insert an API token that belongs to your user account, I did not look into this
due to time constrains. This means the Github API is quite rate limited. You'll notice this when you fire too much queries
within a short period of time. An error message is displayed for this, but Github is quite forgiving, so give it a rest
for a minute and try again.

## Approach
I took an approach where I focussed mainly on showing how I usually setup my React projects. I chose to work with Typescript,
because it protects me for many bugs. Besides that, I always try to make a difference between "dumb" components, which only
interact with props and components that interact with application state. The dumb components can be found within the components
folder, the "smart" components are stored alongside the pages that were created.

### Styling
Like I said, my main focus was on the React setup, so I took the liberty of not spending too much time goldplating the
design, like you can probably see... I deliberately also did not spend time on the responsive design, so please look at
this page on a desktop browser.

For the styling that I did, I used the global stylesheet that shipped along with the Vite bootstrap. For the individual
components, I've chosen to use CSS modules since they offer a flexible approach to styling without introducing a whole
new tool (like Styled Components).

### State management
The query to Github can be submitted via three ways:

1. The search bar
2. The filter bar
3. The sort list

Because these all reside in different components, you need a way to share the state of the query being constructed by
these three elements. I chose for introducing a reducer, along with a context to make this reducer available to the components
without constantly passing through props.

The reason I did this is because reducers are very insightful in managing state and because the Search page component isn't
cluttered too much with business logic for keeping state.

The downside of using a reducer is that React queues the state updates fired via dispatch and there is no nice way to know
your `dispatch` method actually succeeded. Hence, I added a `useEffect` listener to the full state, where a state change
always leads to a call to Github, as long as the `query` is present in the state.

Modifying the `query` always leads to a full refresh of the state. Modifying the filters or sort extend the existing state.
This seemed the most logical flow.

### Keeping track of history
For keeping track of history, I've used the Dexie NPM module, which uses IndexedDB to store data. Reason I chose this is
because the dataset is quite large and `localStorage` only provides a key-value store, where the value is always a string.
This would lead to stringifying the whole result set, along with the query. Though this is possible, it felt like the
wrong tool for what I wanted to achieve.

When Github returns results, the first 10 results are stored, along with the query object that was sent to Github. These
queries are shown on the history page, where clicking on one of them will fetch the results from the databse (so not
from Github).

The IndexedDB resides within your browser, meaning history is kept locally.

## Closing thoughts
I'm pretty happy with the result. Though there probably are many things that can be improved (styling, dealing with
error states, Typescript typing of `null` / `undefined` values, allowing multiple filters, old browser compatibility),
I'm pretty happy with the result. In my first interview, I was told this should been do-able within 2 hours, which is
probably an estimate that doesn't take this setup into account, because I've been feeling quite productive and spent a
lot more time on this.

Have fun reviewing this. If things aren't clear in the setup, feel free to contact me.
