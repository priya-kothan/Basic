import React, { lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import FFSpinner from '../components/base/FFSpinner/FFSpinner'

const PageNotFound = lazy(() => import('../pages/PageNotFound/PageNotFound'))
const Field = lazy(() => import('../pages/Fields/Fields'))
const Home = lazy(() => import('../pages/Home/Home'))
const ListViewViewer = lazy(() =>
  import('../pages/ListViewViewer/ListViewViewer')
)
const ListViews = lazy(() => import('../pages/ListViews/ListViews'))
const EntityGridDesigner = lazy(() =>
  import('../pages/EntityGridDesigner/EntityGridDesigner')
)

const CreateFormDesigner = lazy(() =>
  import(
    '../components/custom/FEDesignerControls/FormDesignerControl/FormDesigner/FormDesigner'
  )
)
const FormViewer = lazy(() => import('../pages/FormViewer/FormViewer'))
const Entities = lazy(() => import('../pages/Entities/Entities'))

const OptionSet = lazy(() => import('../pages/OptionSet/OptionSet'))
const CorrespondenceEditor = lazy(() =>
  import('../pages/CorrespondenceEditor/CorrespondenceEditor')
)
const CorrespondenceLists = lazy(() =>
  import('../pages/CorrespondenceLists/CorrespondenceLists')
)
const FormDesigner = lazy(() => import('../pages/FormDesigner/FormDesigner'))
const FilterDesignerPage = lazy(() =>
  import('../pages/FilterDesigner/FilterDesigner')
)

const Search = lazy(() => import('../pages/Search/Search'))
const FileManagerView = lazy(() =>
  import('../pages/FileManagerView/FileManagerView')
)

const Routes = () => {
  return (
    <React.Suspense fallback={<FFSpinner />}>
      <Switch>
        <Route exact path="/" component={Entities} />
        <Route exact path="/Entities" component={Entities} />
        <Route path="/Field" component={Field} />
        <Route exact path="/OptionSet" component={OptionSet} />
        <Route exact path="/list/:entityName" component={ListViewViewer} />
        <Route exact path="/listViews" component={ListViews} />
        <Route exact path="/sysListDesigner" component={EntityGridDesigner} />
        <Route exact path="/FormDesigner" component={FormDesigner} />
        <Route exact path="/formViewer" component={FormViewer} />
        <Route
          exact
          path="/CreateFormDesigner"
          component={CreateFormDesigner}
        />
        <Route
          exact
          path="/correspondenceEditor"
          component={CorrespondenceEditor}
        />
        <Route
          exact
          path="/correspondenceLists"
          component={CorrespondenceLists}
        />
        <Route exact path="/FilterDesigner" component={FilterDesignerPage} />
        <Route exact path="/Search" component={Search} />
        <Route exact path="/fileManager" component={FileManagerView} />
        <Route path="/404" component={PageNotFound} />
        <Redirect to="/404" />
      </Switch>
    </React.Suspense>
  )
}

export default Routes
